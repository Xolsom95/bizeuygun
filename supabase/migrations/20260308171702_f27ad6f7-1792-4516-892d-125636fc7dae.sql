
-- Drop the overly permissive insert policy
DROP POLICY "Authenticated users can insert notifications" ON public.notifications;

-- Create a more restrictive insert policy (users can only insert notifications for themselves or via triggers)
CREATE POLICY "Users can insert their own notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
