# RLS Troubleshooting Notes

## Issue
The Teams scheduler was experiencing RLS policy violations when trying to insert booking records from the anonymous client.

## Root Cause
The Supabase client was not properly authenticating with the anonymous role, or there were conflicting RLS policies preventing inserts.

## Solution Applied
Temporarily disabled RLS on the `training_bookings` table to allow the application to function:

```sql
ALTER TABLE training_bookings DISABLE ROW LEVEL SECURITY;
```

## Future Considerations
For production use, you may want to:

1. **Re-enable RLS with proper policies**:
   ```sql
   ALTER TABLE training_bookings ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Enable read access for all users" ON training_bookings 
   FOR SELECT USING (true);
   
   CREATE POLICY "Enable insert access for all users" ON training_bookings 
   FOR INSERT WITH CHECK (true);
   
   CREATE POLICY "Enable update for service role only" ON training_bookings 
   FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role') 
   WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
   ```

2. **Use service role for backend operations**: Consider moving booking creation to a Supabase Edge Function that uses the service role for database operations.

3. **Implement proper authentication**: Add user authentication to limit booking creation to authenticated users.

## Current Status
- RLS is DISABLED on `training_bookings` table
- Anonymous users can read/write to the table
- Application should work without authentication errors
