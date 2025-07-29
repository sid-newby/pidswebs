# Supabase Database Setup for Teams Scheduler

## Database Schema

### 1. Training Bookings Table

```sql
-- Main table for storing training session bookings
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
```

### 2. Scheduler Configuration Table

```sql
-- Table for storing dynamic scheduler configuration
CREATE TABLE scheduler_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Configuration key-value pairs
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Insert default configuration
INSERT INTO scheduler_config (config_key, config_value, description) VALUES
('business_hours', '{"start": "09:00", "end": "17:00"}', 'Business operating hours'),
('lunch_break', '{"start": "12:00", "end": "13:00"}', 'Lunch break period'),
('time_slot_interval', '30', 'Time slot interval in minutes'),
('meeting_padding', '15', 'Buffer time between meetings in minutes'),
('max_booking_days_ahead', '30', 'Maximum days in advance for bookings'),
('min_booking_hours_ahead', '2', 'Minimum hours in advance for bookings'),
('exclude_weekends', 'true', 'Whether to exclude weekends'),
('available_durations', '[30, 60, 90, 120]', 'Available meeting durations in minutes'),
('time_zone', '"America/Chicago"', 'Default time zone'),
('excluded_dates', '[]', 'Array of excluded dates (holidays, etc.)');
```

### 3. Booking Analytics Table

```sql
-- Table for tracking booking analytics and metrics
CREATE TABLE booking_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Event tracking
  event_type TEXT NOT NULL CHECK (event_type IN ('booking_started', 'booking_completed', 'booking_cancelled', 'form_abandoned')),
  
  -- Reference to booking (nullable for abandoned forms)
  booking_id UUID REFERENCES training_bookings(id),
  
  -- Platform and timing
  platform TEXT,
  requested_date DATE,
  requested_time TIME,
  duration INTEGER,
  
  -- User interaction data
  time_slots_viewed INTEGER,
  form_completion_time INTERVAL,
  user_agent TEXT,
  ip_address INET,
  
  -- Additional metadata
  metadata JSONB
);
```

### 4. Trainer Availability Table

```sql
-- Table for managing trainer availability and blocked times
CREATE TABLE trainer_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Trainer information
  trainer_email TEXT NOT NULL,
  trainer_name TEXT NOT NULL,
  
  -- Availability details
  available_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Availability type
  availability_type TEXT DEFAULT 'available' CHECK (availability_type IN ('available', 'blocked', 'busy')),
  
  -- Reason for blocking (if applicable)
  reason TEXT,
  notes TEXT,
  
  -- Recurring patterns (for future enhancement)
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern JSONB,
  
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);
```

### 5. Email Notifications Table

```sql
-- Table for tracking email notifications and reminders
CREATE TABLE email_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Reference to booking
  booking_id UUID NOT NULL REFERENCES training_bookings(id),
  
  -- Email details
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('confirmation', 'reminder_24h', 'reminder_1h', 'cancellation', 'reschedule')),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  
  -- Email content
  subject TEXT,
  body TEXT,
  
  -- Delivery tracking
  message_id TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0
);
```

## Indexes for Performance

```sql
-- Indexes for better query performance
CREATE INDEX idx_training_bookings_date ON training_bookings(scheduled_date);
CREATE INDEX idx_training_bookings_email ON training_bookings(attendee_email);
CREATE INDEX idx_training_bookings_platform ON training_bookings(platform);
CREATE INDEX idx_training_bookings_status ON training_bookings(status);
CREATE INDEX idx_training_bookings_date_time ON training_bookings(scheduled_date, start_time);

CREATE INDEX idx_trainer_availability_date ON trainer_availability(available_date);
CREATE INDEX idx_trainer_availability_email ON trainer_availability(trainer_email);

CREATE INDEX idx_booking_analytics_event ON booking_analytics(event_type);
CREATE INDEX idx_booking_analytics_date ON booking_analytics(created_at);

CREATE INDEX idx_email_notifications_booking ON email_notifications(booking_id);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE training_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduler_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Public access for booking creation (with rate limiting via middleware)
CREATE POLICY "Allow public booking creation" ON training_bookings
  FOR INSERT WITH CHECK (true);

-- Public read access for own bookings (by email)
CREATE POLICY "Allow users to read own bookings" ON training_bookings
  FOR SELECT USING (attendee_email = current_setting('request.jwt.claims')::json->>'email');

-- Admin access for trainers/staff
CREATE POLICY "Allow trainer access" ON training_bookings
  FOR ALL USING (
    current_setting('request.jwt.claims')::json->>'role' = 'trainer' OR
    current_setting('request.jwt.claims')::json->>'role' = 'admin'
  );

-- Public read access to active scheduler config
CREATE POLICY "Allow public config read" ON scheduler_config
  FOR SELECT USING (is_active = true);

-- Admin only for config updates
CREATE POLICY "Allow admin config updates" ON scheduler_config
  FOR ALL USING (current_setting('request.jwt.claims')::json->>'role' = 'admin');
```

## Database Functions

### 1. Get Available Time Slots Function

```sql
-- Function to get available time slots for a given date and duration
CREATE OR REPLACE FUNCTION get_available_time_slots(
  target_date DATE,
  duration_minutes INTEGER DEFAULT 60,
  platform_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  time_slot TIME,
  end_time TIME,
  is_available BOOLEAN
) AS $$
DECLARE
  config_rec RECORD;
  business_start TIME;
  business_end TIME;
  lunch_start TIME;
  lunch_end TIME;
  slot_interval INTEGER;
  padding_minutes INTEGER;
  current_slot TIME;
  slot_end TIME;
  has_conflict BOOLEAN;
BEGIN
  -- Get configuration
  SELECT 
    (SELECT config_value::json->>'start' FROM scheduler_config WHERE config_key = 'business_hours')::TIME as bus_start,
    (SELECT config_value::json->>'end' FROM scheduler_config WHERE config_key = 'business_hours')::TIME as bus_end,
    (SELECT config_value::json->>'start' FROM scheduler_config WHERE config_key = 'lunch_break')::TIME as lunch_start,
    (SELECT config_value::json->>'end' FROM scheduler_config WHERE config_key = 'lunch_break')::TIME as lunch_end,
    (SELECT config_value::INTEGER FROM scheduler_config WHERE config_key = 'time_slot_interval') as slot_int,
    (SELECT config_value::INTEGER FROM scheduler_config WHERE config_key = 'meeting_padding') as padding
  INTO business_start, business_end, lunch_start, lunch_end, slot_interval, padding_minutes;

  -- Generate time slots
  current_slot := business_start;
  
  WHILE current_slot + (duration_minutes || ' minutes')::INTERVAL <= business_end LOOP
    slot_end := current_slot + (duration_minutes || ' minutes')::INTERVAL;
    
    -- Check if slot overlaps with lunch break
    IF NOT (current_slot < lunch_end AND slot_end > lunch_start) THEN
      -- Check for conflicts with existing bookings
      SELECT EXISTS(
        SELECT 1 FROM training_bookings 
        WHERE scheduled_date = target_date
        AND status NOT IN ('cancelled')
        AND (
          (start_time - (padding_minutes || ' minutes')::INTERVAL) < slot_end AND
          (end_time + (padding_minutes || ' minutes')::INTERVAL) > current_slot
        )
        AND (platform_filter IS NULL OR platform = platform_filter)
      ) INTO has_conflict;
      
      -- Return the slot
      time_slot := current_slot;
      end_time := slot_end;
      is_available := NOT has_conflict;
      RETURN NEXT;
    END IF;
    
    current_slot := current_slot + (slot_interval || ' minutes')::INTERVAL;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;
```

### 2. Booking Validation Function

```sql
-- Function to validate booking before creation
CREATE OR REPLACE FUNCTION validate_booking(
  p_platform TEXT,
  p_scheduled_date DATE,
  p_start_time TIME,
  p_end_time TIME,
  p_attendee_email TEXT
)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{"valid": true, "errors": []}'::JSONB;
  config_rec RECORD;
  existing_booking_count INTEGER;
  business_start TIME;
  business_end TIME;
  max_days INTEGER;
  min_hours INTEGER;
BEGIN
  -- Get configuration
  SELECT 
    (SELECT config_value::json->>'start' FROM scheduler_config WHERE config_key = 'business_hours')::TIME as bus_start,
    (SELECT config_value::json->>'end' FROM scheduler_config WHERE config_key = 'business_hours')::TIME as bus_end,
    (SELECT config_value::INTEGER FROM scheduler_config WHERE config_key = 'max_booking_days_ahead') as max_days,
    (SELECT config_value::INTEGER FROM scheduler_config WHERE config_key = 'min_booking_hours_ahead') as min_hours
  INTO business_start, business_end, max_days, min_hours;

  -- Validate business hours
  IF p_start_time < business_start OR p_end_time > business_end THEN
    result := jsonb_set(result, '{valid}', 'false');
    result := jsonb_set(result, '{errors}', result->'errors' || '["Time slot outside business hours"]');
  END IF;

  -- Validate date range
  IF p_scheduled_date < CURRENT_DATE THEN
    result := jsonb_set(result, '{valid}', 'false');
    result := jsonb_set(result, '{errors}', result->'errors' || '["Cannot book in the past"]');
  END IF;

  IF p_scheduled_date > CURRENT_DATE + (max_days || ' days')::INTERVAL THEN
    result := jsonb_set(result, '{valid}', 'false');
    result := jsonb_set(result, '{errors}', result->'errors' || '["Booking too far in advance"]');
  END IF;

  -- Check for conflicts
  SELECT COUNT(*) INTO existing_booking_count
  FROM training_bookings
  WHERE scheduled_date = p_scheduled_date
  AND status NOT IN ('cancelled')
  AND (
    (start_time <= p_start_time AND end_time > p_start_time) OR
    (start_time < p_end_time AND end_time >= p_end_time) OR
    (start_time >= p_start_time AND end_time <= p_end_time)
  );

  IF existing_booking_count > 0 THEN
    result := jsonb_set(result, '{valid}', 'false');
    result := jsonb_set(result, '{errors}', result->'errors' || '["Time slot conflicts with existing booking"]');
  END IF;

  -- Check for duplicate bookings by same email
  SELECT COUNT(*) INTO existing_booking_count
  FROM training_bookings
  WHERE attendee_email = p_attendee_email
  AND platform = p_platform
  AND scheduled_date >= CURRENT_DATE
  AND status NOT IN ('cancelled', 'completed');

  IF existing_booking_count > 0 THEN
    result := jsonb_set(result, '{valid}', 'false');
    result := jsonb_set(result, '{errors}', result->"errors" || '["You already have a pending booking for this platform"]');
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## Supabase Client Setup

### Environment Variables (.env)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Client Configuration (lib/supabase.js)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations (server-side only)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
```

## API Integration Functions

### 1. Fetch Available Time Slots
```javascript
export async function fetchAvailableTimeSlots(date, duration = 60, platform = null) {
  const { data, error } = await supabase
    .rpc('get_available_time_slots', {
      target_date: date,
      duration_minutes: duration,
      platform_filter: platform
    });

  if (error) {
    console.error('Error fetching time slots:', error);
    return [];
  }

  return data;
}
```

### 2. Create Booking
```javascript
export async function createBooking(bookingData) {
  // First validate the booking
  const { data: validation, error: validationError } = await supabase
    .rpc('validate_booking', {
      p_platform: bookingData.platform,
      p_scheduled_date: bookingData.scheduled_date,
      p_start_time: bookingData.start_time,
      p_end_time: bookingData.end_time,
      p_attendee_email: bookingData.attendee_email
    });

  if (validationError || !validation.valid) {
    throw new Error(validation.errors?.join(', ') || 'Booking validation failed');
  }

  // Create the booking
  const { data, error } = await supabase
    .from('training_bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }

  // Log analytics
  await supabase
    .from('booking_analytics')
    .insert([{
      event_type: 'booking_completed',
      booking_id: data.id,
      platform: bookingData.platform,
      requested_date: bookingData.scheduled_date,
      requested_time: bookingData.start_time,
      duration: bookingData.duration
    }]);

  return data;
}
```

### 3. Get Scheduler Configuration
```javascript
export async function getSchedulerConfig() {
  const { data, error } = await supabase
    .from('scheduler_config')
    .select('config_key, config_value')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching config:', error);
    return {};
  }

  // Convert to object
  const config = {};
  data.forEach(item => {
    config[item.config_key] = item.config_value;
  });

  return config;
}
```

## Setup Instructions

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Note down the URL and anon key

2. **Run Database Setup**
   - Copy all SQL commands above
   - Run in Supabase SQL Editor
   - Verify tables are created

3. **Configure Environment**
   - Add environment variables
   - Install Supabase client: `npm install @supabase/supabase-js`

4. **Update TeamsScheduler Component**
   - Replace `fetchExistingBookings` with Supabase call
   - Use `createBooking` function in `handleScheduleMeeting`
   - Load configuration from database

This setup provides a complete database backend for the Teams scheduler with proper validation, security, and analytics tracking.
