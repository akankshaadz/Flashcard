/*
  # Create flashcards table

  1. New Tables
    - `flashcards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `question` (text, not null)
      - `answer` (text, not null)
      - `category` (text, not null)
      - `created_at` (timestamp with time zone)
      - `viewed_by` (text array for storing user IDs who have viewed this card)

  2. Security
    - Enable RLS on `flashcards` table
    - Add policy for authenticated users to insert their own flashcards
    - Add policy for authenticated users to read all flashcards
    - Add policy for authenticated users to update flashcards they own
*/

CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  viewed_by text[] DEFAULT '{}'
);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Policy for users to insert their own flashcards
CREATE POLICY "Users can insert own flashcards"
  ON flashcards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to read all flashcards (for studying)
CREATE POLICY "Users can read all flashcards"
  ON flashcards
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for users to update their own flashcards
CREATE POLICY "Users can update own flashcards"
  ON flashcards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own flashcards
CREATE POLICY "Users can delete own flashcards"
  ON flashcards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);