/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `business_name` (text)
      - `specialization` (text array)
      - `experience` (text)
      - `location` (text)
      - `phone` (text)
      - `website` (text)
      - `communication_prefs` (text array)
      - `marketing_consent` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to read and update their own profile
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  business_name text,
  specialization text[] DEFAULT '{}',
  experience text,
  location text,
  phone text,
  website text,
  communication_prefs text[] DEFAULT '{}',
  marketing_consent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    first_name,
    last_name,
    business_name,
    specialization,
    experience,
    location,
    phone,
    website,
    communication_prefs,
    marketing_consent
  )
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'business_name',
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'specialization')), '{}'),
    new.raw_user_meta_data->>'experience',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'website',
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'communication_prefs')), '{}'),
    COALESCE((new.raw_user_meta_data->>'marketing_consent')::boolean, false)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();