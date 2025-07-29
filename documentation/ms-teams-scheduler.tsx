import React, { useState, useEffect } from 'react';
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';
import { Calendar, Clock, Users, Video, ChevronRight, Loader2 } from 'lucide-react';

// Initialize MSAL provider (in real app, move to separate auth file)
const initializeAuth = () => {
  Providers.globalProvider = new Msal2Provider({
    clientId: 'YOUR_CLIENT_ID', // Replace with your Azure AD app client ID
    scopes: ['calendars.read', 'calendars.readwrite', 'user.read', 'people.read'],
  });
};

// Mock data for demo
const mockTimeSlots = [
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: false },
  { time: '4:00 PM', available: true },
];

const mockAttendees = [
  { name: 'John Doe', email: 'john@company.com', available: true },
  { name: 'Jane Smith', email: 'jane@company.com', available: true },
  { name: 'Bob Wilson', email: 'bob@company.com', available: false },
];

export default function MicrosoftTeamsScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Initialize auth on component mount
    // initializeAuth(); // Uncomment in real implementation
  }, []);

  const handleScheduleMeeting = async () => {
    setIsLoading(true);
    
    // In real implementation, this would call Microsoft Graph API
    // Example endpoint: POST https://graph.microsoft.com/v1.0/me/calendar/events
    
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const findMeetingTimes = async () => {
    setIsLoading(true);
    
    // In real implementation:
    // POST https://graph.microsoft.com/v1.0/me/findMeetingTimes
    // with attendees, time constraints, and duration
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Video className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Microsoft Teams Meeting Scheduler</h1>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">✓ Meeting scheduled successfully! Teams link will be sent to all attendees.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Meeting Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Team Sync Meeting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mockTimeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedTime === slot.time
                          ? 'bg-blue-600 text-white'
                          : slot.available
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Attendees */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Select Attendees
                </label>
                <div className="border border-gray-300 rounded-md p-3 space-y-2 max-h-64 overflow-y-auto">
                  {mockAttendees.map((attendee) => (
                    <label
                      key={attendee.email}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAttendees.includes(attendee.email)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setSelectedAttendees([...selectedAttendees, attendee.email]);
                          } else {
                            setSelectedAttendees(selectedAttendees.filter(email => email !== attendee.email));
                          }
                        }}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{attendee.name}</p>
                        <p className="text-xs text-gray-500">{attendee.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        attendee.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {attendee.available ? 'Available' : 'Busy'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={findMeetingTimes}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Clock className="w-4 h-4 mr-2" />
                )}
                Find Best Meeting Times
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Microsoft Teams Integration:</strong> A Teams meeting link will be automatically 
                  generated and included in the calendar invitation.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setMeetingTitle('');
                setSelectedTime('');
                setSelectedAttendees([]);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleScheduleMeeting}
              disabled={!meetingTitle || !selectedTime || selectedAttendees.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <>
                  Schedule Meeting
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Implementation Guide</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>1. Authentication:</strong> Register your app in Azure AD and configure MSAL2 provider with required scopes 
              (calendars.read, calendars.readwrite, user.read, people.read).
            </p>
            <p>
              <strong>2. Key APIs:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Create events: POST /me/calendar/events</li>
              <li>Find meeting times: POST /me/findMeetingTimes</li>
              <li>Get free/busy info: POST /me/calendar/getSchedule</li>
              <li>List calendars: GET /me/calendars</li>
            </ul>
            <p>
              <strong>3. Teams Integration:</strong> When creating an event, set isOnlineMeeting=true and 
              onlineMeetingProvider='teamsForBusiness' to automatically generate Teams meeting links.
            </p>
            <p>
              <strong>4. Real-time Updates:</strong> Use Microsoft Graph webhooks to receive notifications 
              when meetings are updated or canceled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}