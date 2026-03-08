
-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- System/authenticated users can insert notifications
CREATE POLICY "Authenticated users can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create a function to auto-create notification on new message
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  sender_name text;
BEGIN
  SELECT name INTO sender_name FROM public.profiles WHERE user_id = NEW.sender_id LIMIT 1;
  
  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    NEW.receiver_id,
    'message',
    'Yeni Mesaj',
    COALESCE(sender_name, 'Birisi') || ' size bir mesaj gönderdi',
    '/mesajlar'
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for new messages
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_message();

-- Create a function to notify on new favorite
CREATE OR REPLACE FUNCTION public.notify_new_favorite()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  lister_user_id uuid;
  fav_user_name text;
BEGIN
  SELECT user_id INTO lister_user_id FROM public.listings WHERE id = NEW.listing_id LIMIT 1;
  SELECT name INTO fav_user_name FROM public.profiles WHERE user_id = NEW.user_id LIMIT 1;
  
  IF lister_user_id IS NOT NULL AND lister_user_id != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      lister_user_id,
      'favorite',
      'Yeni Favori',
      COALESCE(fav_user_name, 'Birisi') || ' ilanınızı favorilere ekledi',
      '/panel'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for new favorites
CREATE TRIGGER on_new_favorite
  AFTER INSERT ON public.favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_favorite();
