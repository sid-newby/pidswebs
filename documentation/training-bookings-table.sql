-- Complete SQL table definition for training_bookings
-- Copy and paste this entire block into Supabase SQL Editor

CREATE TABLE training_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Platform information
  platform TEXT NOT NULL CHECK (platform IN ('Reveal', 'Relativity', 'iConect')),
  
  -- Attendee information
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_company TEXT,
  attendee_phone TEXT,
  
  -- Meeting details
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  time_zone TEXT DEFAULT 'America/Chicago',
  
  -- Microsoft Teams integration
  teams_meeting_id TEXT,
  teams_meeting_url TEXT,
  calendar_event_id TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
  
  -- Additional metadata
  notes TEXT,
  trainer_email TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  
  -- Constraints
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT future_booking CHECK (scheduled_date >= CURRENT_DATE)
);

-- Create indexes for performance
CREATE INDEX idx_training_bookings_date ON training_bookings(scheduled_date);
CREATE INDEX idx_training_bookings_email ON training_bookings(attendee_email);
CREATE INDEX idx_training_bookings_platform ON training_bookings(platform);
CREATE INDEX idx_training_bookings_status ON training_bookings(status);
CREATE INDEX idx_training_bookings_date_time ON training_bookings(scheduled_date, start_time);

-- Enable Row Level Security
ALTER TABLE training_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public booking creation" ON training_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to read own bookings" ON training_bookings
  FOR SELECT USING (attendee_email = current_setting('request.jwt.claims')::json->>'email');
