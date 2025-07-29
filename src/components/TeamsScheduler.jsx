import { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar, Clock, Users, Video, ChevronRight, Loader2, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { bookingService } from '@/lib/supabase';
import PropTypes from 'prop-types';

// Production Configuration - can be moved to environment variables
const SCHEDULER_CONFIG = {
  businessHours: {
    start: '09:00',
    end: '17:00'
  },
  timeSlotInterval: 30, // minutes
  meetingPadding: 15, // minutes buffer between meetings
  maxBookingDaysAhead: 30,
  minBookingHoursAhead: 2,
  excludeWeekends: true,
  excludedDates: [], // Array of 'YYYY-MM-DD' strings for holidays/blocked dates
  defaultDuration: 60,
  availableDurations: [30, 60, 90, 120], // minutes
  timeZone: 'America/Chicago',
  lunchBreak: {
    start: '12:00',
    end: '13:00'
  }
};

// Utility functions for date/time manipulation
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const formatTimeForDisplay = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
};

const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

// Fetch existing bookings from database
const fetchExistingBookings = async (date) => {
  try {
    return await bookingService.getBookingsForDate(date);
  } catch (error) {
    console.error('Failed to fetch existing bookings:', error);
    return [];
  }
};

export default function TeamsScheduler({ platform, isOpen, onClose }) {
  // Initialize with tomorrow to avoid any timezone edge cases with today's date
  const getInitialDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [attendeeCompany, setAttendeeCompany] = useState('');
  const [duration, setDuration] = useState(SCHEDULER_CONFIG.defaultDuration.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Load existing bookings when component opens or date changes
  useEffect(() => {
    if (isOpen && selectedDate) {
      const loadBookings = async () => {
        try {
          const bookings = await fetchExistingBookings(selectedDate);
          setExistingBookings(bookings);
        } catch (error) {
          console.error('Failed to load existing bookings:', error);
          setExistingBookings([]); // Fallback to empty array
        }
      };
      loadBookings();
    }
  }, [isOpen, selectedDate]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTime('');
      setAttendeeEmail('');
      setAttendeeName('');
      setAttendeePhone('');
      setAttendeeCompany('');
      setShowSuccess(false);
      setValidationErrors([]);
    }
  }, [isOpen]);

  // Generate available time slots with conflict detection and padding
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];

    const slots = [];
    const startMinutes = timeToMinutes(SCHEDULER_CONFIG.businessHours.start);
    const endMinutes = timeToMinutes(SCHEDULER_CONFIG.businessHours.end);
    const lunchStartMinutes = timeToMinutes(SCHEDULER_CONFIG.lunchBreak.start);
    const lunchEndMinutes = timeToMinutes(SCHEDULER_CONFIG.lunchBreak.end);
    const selectedDuration = parseInt(duration);
    const now = new Date();
    const selectedDateObj = new Date(selectedDate);
    const isToday = selectedDateObj.toDateString() === now.toDateString();

    // Check if date should be excluded
    if (SCHEDULER_CONFIG.excludeWeekends && isWeekend(selectedDate)) {
      return [];
    }
    
    if (SCHEDULER_CONFIG.excludedDates.includes(selectedDate)) {
      return [];
    }

    // Get bookings for selected date
    const dayBookings = existingBookings.filter(booking => booking.date === selectedDate);

    for (let minutes = startMinutes; minutes + selectedDuration <= endMinutes; minutes += SCHEDULER_CONFIG.timeSlotInterval) {
      const slotStart = minutes;
      const slotEnd = minutes + selectedDuration;
      const timeString = minutesToTime(minutes);

      // Skip lunch break
      if (slotStart < lunchEndMinutes && slotEnd > lunchStartMinutes) {
        continue;
      }

      // Check if slot is in the past (for today only)
      if (isToday) {
        const slotDateTime = new Date(selectedDate + 'T' + timeString);
        const minBookingTime = new Date(now.getTime() + (SCHEDULER_CONFIG.minBookingHoursAhead * 60 * 60 * 1000));
        if (slotDateTime < minBookingTime) {
          continue;
        }
      }

      // Check for conflicts with existing bookings (including padding)
      let hasConflict = false;
      for (const booking of dayBookings) {
        const bookingStart = timeToMinutes(booking.startTime) - SCHEDULER_CONFIG.meetingPadding;
        const bookingEnd = timeToMinutes(booking.endTime) + SCHEDULER_CONFIG.meetingPadding;
        
        if (slotStart < bookingEnd && slotEnd > bookingStart) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        slots.push({
          time: timeString,
          displayTime: formatTimeForDisplay(timeString),
          available: true,
          endTime: minutesToTime(slotEnd)
        });
      }
    }

    return slots;
  }, [selectedDate, duration, existingBookings]);

  // Validate form data
  const validateForm = useCallback(() => {
    const errors = [];
    
    if (!attendeeName.trim()) {
      errors.push('Name is required');
    }
    
    if (!attendeeEmail.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!selectedDate) {
      errors.push('Please select a date');
    }
    
    if (!selectedTime) {
      errors.push('Please select a time slot');
    }

    // Check if selected date is too far in the future
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + SCHEDULER_CONFIG.maxBookingDaysAhead);
    if (new Date(selectedDate) > maxDate) {
      errors.push(`Bookings can only be made up to ${SCHEDULER_CONFIG.maxBookingDaysAhead} days in advance`);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [attendeeName, attendeeEmail, selectedDate, selectedTime]);

  // Get minimum and maximum booking dates
  const getDateLimits = () => {
    const today = new Date();
    // Set minimum to tomorrow to avoid any timezone edge cases
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
    
    const maxDate = new Date(today.getTime() + (SCHEDULER_CONFIG.maxBookingDaysAhead * 24 * 60 * 60 * 1000));
    
    return {
      min: minDate.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0]
    };
  };

  const dateOptions = getDateLimits();

  const handleScheduleMeeting = async () => {
    if (!validateForm()) {
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

      // 1. Save booking to the database
      const booking = await bookingService.createBooking(meetingData);
      console.log('Booking saved to database:', booking);

      // 2. For now, we'll skip the Teams meeting creation since the Edge Function isn't set up
      // TODO: Implement Edge Function for Teams meeting creation
      console.log('Booking created successfully. Teams meeting integration pending.');

      // 3. Update local state with the confirmed booking details
      const newBooking = {
        id: booking.id,
        date: booking.scheduled_date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        platform: booking.platform,
        attendee: booking.attendee_email,
        duration: booking.duration,
        status: booking.status,
        teamsMeetingUrl: null, // Will be populated when Edge Function is implemented
      };
      
      setExistingBookings(prev => [...prev.filter(b => b.id !== booking.id), newBooking]);
      
      setShowSuccess(true);
      
      // Auto-close after showing success message
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 4000);
      
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      let errorMessage = 'Failed to schedule meeting. Please try again.';
      
      // Handle specific database errors
      if (error.message?.includes('duplicate key')) {
        errorMessage = 'This time slot is no longer available. Please select a different time.';
      } else if (error.message?.includes('constraint')) {
        errorMessage = 'Invalid booking data. Please check your inputs and try again.';
      }
      
      setValidationErrors([errorMessage]);
    }
    
    setIsLoading(false);
  };

  // Configuration panel component
  const ConfigPanel = () => (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Scheduler Configuration
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfig(!showConfig)}
          className="text-xs"
        >
          {showConfig ? 'Hide' : 'Show'} Settings
        </Button>
      </div>
      
      {showConfig && (
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div>
            <p><strong>Business Hours:</strong> {SCHEDULER_CONFIG.businessHours.start} - {SCHEDULER_CONFIG.businessHours.end}</p>
            <p><strong>Time Slots:</strong> Every {SCHEDULER_CONFIG.timeSlotInterval} minutes</p>
            <p><strong>Meeting Padding:</strong> {SCHEDULER_CONFIG.meetingPadding} minutes</p>
          </div>
          <div>
            <p><strong>Advance Booking:</strong> {SCHEDULER_CONFIG.minBookingHoursAhead}h - {SCHEDULER_CONFIG.maxBookingDaysAhead}d</p>
            <p><strong>Lunch Break:</strong> {SCHEDULER_CONFIG.lunchBreak.start} - {SCHEDULER_CONFIG.lunchBreak.end}</p>
            <p><strong>Weekends:</strong> {SCHEDULER_CONFIG.excludeWeekends ? 'Excluded' : 'Included'}</p>
          </div>
        </div>
      )}
    </div>
  );

  if (!platform) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Video className="w-6 h-6 text-blue-600" />
              Schedule {platform.name} Training via Teams
            </DialogTitle>
            <DialogDescription>
              Select a date and time slot, then provide your contact information to schedule a training session.
            </DialogDescription>
          </DialogHeader>

        {/* Success Message */}
        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Training Session Scheduled!</strong><br />
              Your booking has been saved. A team member will contact you at {attendeeEmail} to provide Teams meeting details.
            </AlertDescription>
          </Alert>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Please fix the following issues:</strong>
              <ul className="list-disc list-inside mt-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Booking Statistics */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800">Available slots for {new Date(selectedDate).toLocaleDateString()}</span>
            </div>
            <span className="text-blue-600 font-semibold">
              {availableTimeSlots.length} slots
            </span>
          </div>
          {availableTimeSlots.length === 0 && selectedDate && (
            <p className="text-xs text-blue-700 mt-1">
              {isWeekend(selectedDate) 
                ? "Weekends are not available for booking." 
                : "No available slots. Try selecting a different date or duration."}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Meeting Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Training Session
              </Label>
              <div className="neumorphic-inset rounded-lg p-3 mt-1">
                <p className="font-semibold text-gray-900">{platform.name} Training</p>
                <p className="text-sm text-gray-600">{platform.description}</p>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date
              </Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime(''); // Reset time when date changes
                }}
                className="neumorphic-inset border-0"
                min={dateOptions.min}
                max={dateOptions.max}
              />
              <p className="text-xs text-gray-500 mt-1">
                Bookings available {SCHEDULER_CONFIG.minBookingHoursAhead}h - {SCHEDULER_CONFIG.maxBookingDaysAhead}d in advance
              </p>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Duration
              </Label>
              <select
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setSelectedTime(''); // Reset time when duration changes
                }}
                className="w-full neumorphic-inset rounded-lg px-3 py-2 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCHEDULER_CONFIG.availableDurations.map(dur => (
                  <option key={dur} value={dur.toString()}>
                    {dur === 60 ? '1 hour' : 
                     dur === 90 ? '1.5 hours' : 
                     dur === 120 ? '2 hours' : 
                     `${dur} minutes`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
                {availableTimeSlots.length > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({availableTimeSlots.length} available)
                  </span>
                )}
              </Label>
              {availableTimeSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${ 
                        selectedTime === slot.time
                          ? 'neumorphic shadow-inner text-blue-600 bg-blue-50'
                          : 'neumorphic-button hover:scale-105 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div>{slot.displayTime}</div>
                        <div className="text-xs text-gray-500">
                          {parseInt(duration)} min
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="neumorphic-inset rounded-lg p-4 text-center text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No available time slots</p>
                  <p className="text-xs mt-1">
                    {selectedDate && isWeekend(selectedDate) 
                      ? "Please select a weekday"
                      : "Try a different date or shorter duration"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Attendee Details */}
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-1" />
                Your Information
              </Label>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="attendeeName" className="text-xs text-gray-600">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="attendeeName"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    className="neumorphic-inset border-0 mt-1"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="attendeeEmail" className="text-xs text-gray-600">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="attendeeEmail"
                    type="email"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    className="neumorphic-inset border-0 mt-1"
                    placeholder="your.email@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="attendeeCompany" className="text-xs text-gray-600">Company/Organization</Label>
                  <Input
                    id="attendeeCompany"
                    value={attendeeCompany}
                    onChange={(e) => setAttendeeCompany(e.target.value)}
                    className="neumorphic-inset border-0 mt-1"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <Label htmlFor="attendeePhone" className="text-xs text-gray-600">Phone Number</Label>
                  <Input
                    id="attendeePhone"
                    type="tel"
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    className="neumorphic-inset border-0 mt-1"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <div className="neumorphic-inset rounded-lg p-4 bg-blue-50">
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm">Microsoft Teams Integration</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    A Teams meeting link will be automatically generated and included in your calendar invitation. 
                    No additional setup required.
                  </p>
                </div>
              </div>
            </div>

            {selectedTime && attendeeEmail && attendeeName && (
              <div className="neumorphic-inset rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Meeting Summary
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <p><strong>Session:</strong> {platform.name} Training</p>
                  <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p><strong>Time:</strong> {formatTimeForDisplay(selectedTime)} - {
                    formatTimeForDisplay(availableTimeSlots.find(slot => slot.time === selectedTime)?.endTime || '')
                  }</p>
                  <p><strong>Duration:</strong> {duration} minutes</p>
                  <p><strong>Attendee:</strong> {attendeeName} ({attendeeEmail})</p>
                  {attendeeCompany && <p><strong>Company:</strong> {attendeeCompany}</p>}
                  <p><strong>Platform:</strong> Microsoft Teams</p>
                  <p><strong>Time Zone:</strong> {SCHEDULER_CONFIG.timeZone}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-xs text-blue-600 flex items-center">
                    <Video className="w-3 h-3 mr-1" />
                    Teams meeting link will be generated automatically
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="neumorphic-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleScheduleMeeting}
            disabled={!selectedTime || !attendeeEmail || !attendeeName || isLoading || showSuccess}
            className="neumorphic-button bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Teams Meeting...
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Meeting Scheduled!
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-2" />
                Schedule Teams Meeting
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">What happens next?</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Calendar invitation sent to {attendeeEmail || 'your email'} with Teams meeting link</li>
            <li>• Our trainer receives automatic notification and prepares session materials</li>
            <li>• {SCHEDULER_CONFIG.meetingPadding}-minute buffer added before/after to prevent conflicts</li>
            <li>• Join via Teams app or web browser using the provided link</li>
            <li>• Session recording and materials shared within 24 hours</li>
          </ul>
        </div>

        <ConfigPanel />
      </DialogContent>
    </Dialog>
  );
}

TeamsScheduler.propTypes = {
  platform: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
