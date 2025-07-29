import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_PUBLIC

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  })
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database functions for training bookings
export const bookingService = {
  // Fetch existing bookings for a specific date
  async getBookingsForDate(date) {
    const { data, error } = await supabase
      .from('training_bookings')
      .select('*')
      .eq('scheduled_date', date)
      .eq('status', 'scheduled')
      .order('start_time')

    if (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }

    return data.map(booking => ({
      id: booking.id,
      date: booking.scheduled_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      platform: booking.platform,
      attendee: booking.attendee_email,
      duration: booking.duration
    }))
  },

  // Create a new booking
  async createBooking(bookingData) {
    const { data, error } = await supabase
      .from('training_bookings')
      .insert([{
        platform: bookingData.platform,
        attendee_name: bookingData.attendee.name,
        attendee_email: bookingData.attendee.email,
        attendee_company: bookingData.attendee.company || null,
        attendee_phone: bookingData.attendee.phone || null,
        scheduled_date: bookingData.date,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
        duration: bookingData.duration,
        time_zone: bookingData.timeZone || 'America/Chicago',
        status: 'scheduled',
        notes: `${bookingData.platform} training session scheduled via Teams Scheduler`,
        trainer_email: 'training@base44.com' // Replace with actual trainer email
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      throw error
    }

    return data
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    const { data, error } = await supabase
      .from('training_bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      console.error('Error updating booking status:', error)
      throw error
    }

    return data
  },

  // Get booking analytics/stats
  async getBookingStats(startDate, endDate) {
    const { data, error } = await supabase
      .from('training_bookings')
      .select('platform, status, scheduled_date')
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)

    if (error) {
      console.error('Error fetching booking stats:', error)
      throw error
    }

    return data
  },

  // Check for booking conflicts
  async checkConflicts(date, startTime, endTime, excludeBookingId = null) {
    let query = supabase
      .from('training_bookings')
      .select('id, start_time, end_time')
      .eq('scheduled_date', date)
      .eq('status', 'scheduled')
      .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)

    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error checking conflicts:', error)
      throw error
    }

    return data.length > 0
  }
}
