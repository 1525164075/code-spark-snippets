
-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create code_snippets table
CREATE TABLE public.code_snippets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'javascript',
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  view_count INTEGER DEFAULT 0,
  share_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'base64url')
);

-- Set up RLS for code_snippets
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

-- Policies for code_snippets
CREATE POLICY "Public snippets are viewable by everyone" ON public.code_snippets
  FOR SELECT USING (NOT is_private OR auth.uid() = author_id);

CREATE POLICY "Users can create snippets" ON public.code_snippets
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own snippets" ON public.code_snippets
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own snippets" ON public.code_snippets
  FOR DELETE USING (auth.uid() = author_id);

-- Create index for better performance
CREATE INDEX idx_code_snippets_share_id ON public.code_snippets(share_id);
CREATE INDEX idx_code_snippets_author_id ON public.code_snippets(author_id);
CREATE INDEX idx_code_snippets_created_at ON public.code_snippets(created_at DESC);
