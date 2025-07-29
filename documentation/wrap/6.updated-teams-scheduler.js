// Updated handleScheduleMeeting function for TeamsScheduler.jsx
// Add these imports at the top of the file:
// import { msalAuth, initializeMsal } from '@/services/msalAuth';
// import { teamsMeetingService } from '@/services/teamsMeeting';

// Add this useEffect to initialize MSAL when component mounts
useEffect(() => {
  initializeMsal();
}, []);

// Add authentication state
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isAuthenticating, setIsAuthenticating] = useState(false);

// Check authentication status when modal opens
useEffect(() => {
  if (isOpen) {
    setIsAuthenticated(msalAuth.isAuthenticated());
  }
}, [isOpen]);

// Add sign-in function
const handleSignIn = async () => {
  setIsAuthenticating(true);
  try {
    await msalAuth.signIn();
    setIsAuthenticated(true);
    setValidationErrors([]);
  } catch (error) {
    console.error('Sign-in error:', error);
    setValidationErrors(['Failed to sign in to Microsoft account. Please try again.']);
  }
  setIsAuthenticating(false);
};

// Replace the existing handleScheduleMeeting function with this:
const handleScheduleMeeting = async () => {
  if (!validateForm()) {
    return;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    setValidationErrors(['Please sign in with your Microsoft account to schedule meetings.']);
    return;
  }

  setIsLoading(true);
  
  try {
    const selectedSlot = availableTimeSlots.find(slot => slot.time === selectedTime);
    const meetingData = {
      platform: platform.name,
      date: selectedDate,
      startTime: selectedTime,
      endTime: selectedSlot.endTime,
      duration: parseInt(duration),
      attendee: {
        name: attendeeName,
        email: attendeeEmail,
        phone: attendeePhone,
        company: attendeeCompany
      },
      timeZone: SCHEDULER_CONFIG.timeZone
    };

    // 1. Create Teams meeting and calendar event
    let teamsMeetingDetails = null;
    try {
      teamsMeetingDetails = await teamsMeetingService.createMeetingWithCalendarEvent(meetingData);
      console.log('Teams meeting created:', teamsMeetingDetails);
    } catch (msError) {
      console.error('Microsoft Graph error:', msError);
      // Continue with booking even if Teams creation fails
      // You might want to handle this differently based on your requirements
    }

    // 2. Save booking to the database with Teams meeting details
    const bookingData = {
      ...meetingData,
      teamsMeetingId: teamsMeetingDetails?.id,
      teamsMeetingUrl: teamsMeetingDetails?.teamsMeetingUrl,
      calendarEventUrl: teamsMeetingDetails?.webLink,
      status: teamsMeetingDetails ? 'confirmed' : 'pending_teams_creation'
    };

    const booking = await bookingService.createBooking(bookingData);
    console.log('Booking saved to database:', booking);

    // 3. Update local state
    const newBooking = {
      id: booking.id,
      date: booking.scheduled_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      platform: booking.platform,
      attendee: booking.attendee_email,
      duration: booking.duration,
      status: booking.status,
      teamsMeetingUrl: teamsMeetingDetails?.teamsMeetingUrl,
    };
    
    setExistingBookings(prev => [...prev.filter(b => b.id !== booking.id), newBooking]);
    
    setShowSuccess(true);
    
    // Auto-close after showing success message
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 5000);
    
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    let errorMessage = 'Failed to schedule meeting. Please try again.';
    
    if (error.message?.includes('duplicate key')) {
      errorMessage = 'This time slot is no longer available. Please select a different time.';
    } else if (error.message?.includes('constraint')) {
      errorMessage = 'Invalid booking data. Please check your inputs and try again.';
    } else if (error.message?.includes('token') || error.message?.includes('auth')) {
      errorMessage = 'Authentication expired. Please sign in again.';
      setIsAuthenticated(false);
    }
    
    setValidationErrors([errorMessage]);
  }
  
  setIsLoading(false);
};

// Update fetchExistingBookings to get from both database and calendar
const fetchExistingBookings = async (date) => {
  try {
    // Get bookings from database
    const dbBookings = await bookingService.getBookingsForDate(date);
    
    // If authenticated, also get calendar events
    let calendarEvents = [];
    if (isAuthenticated) {
      try {
        calendarEvents = await teamsMeetingService.getCalendarEvents(date);
        console.log('Calendar events:', calendarEvents);
      } catch (error) {
        console.error('Failed to fetch calendar events:', error);
      }
    }
    
    // Merge bookings (you might want to deduplicate based on your logic)
    return [...dbBookings, ...calendarEvents];
  } catch (error) {
    console.error('Failed to fetch existing bookings:', error);
    return [];
  }
};

// Add this authentication UI component inside your Dialog content, before the success message:
{!isAuthenticated && (
  <Alert className="border-blue-200 bg-blue-50 mb-4">
    <AlertCircle className="h-4 w-4 text-blue-600" />
    <AlertDescription className="text-blue-800 flex items-center justify-between">
      <span>Sign in with Microsoft to schedule Teams meetings</span>
      <Button
        onClick={handleSignIn}
        disabled={isAuthenticating}
        size="sm"
        className="ml-4 bg-blue-600 text-white hover:bg-blue-700"
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Signing in...
          </>
        ) : (
          <>
            <Video className="w-4 h-4 mr-2" />
            Sign in with Microsoft
          </>
        )}
      </Button>
    </AlertDescription>
  </Alert>
)}

// Update the success message to show Teams meeting link
{showSuccess && (
  <Alert className="border-green-200 bg-green-50">
    <CheckCircle className="h-4 w-4 text-green-600" />
    <AlertDescription className="text-green-800">
      <strong>Training Session Scheduled!</strong><br />
      {teamsMeetingDetails?.teamsMeetingUrl ? (
        <>
          Teams meeting created successfully! The meeting link has been sent to {attendeeEmail}.
          <a 
            href={teamsMeetingDetails.webLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-2 text-blue-600 hover:underline"
          >
            View in Outlook Calendar →
          </a>
        </>
      ) : (
        <>Your booking has been saved. A team member will contact you at {attendeeEmail} to provide Teams meeting details.</>
      )}
    </AlertDescription>
  </Alert>
)}