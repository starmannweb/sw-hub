-- Create Sites table
CREATE TABLE IF NOT EXISTS public.sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    content JSONB,
    published_html TEXT,
    published_css TEXT,
    is_published BOOLEAN DEFAULT false,
    preview_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, slug) -- Previne um usuario de ter dois sites com a mesma url slug
);

-- Create Site Templates table
CREATE TABLE IF NOT EXISTS public.site_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    content JSONB NOT NULL,
    preview_image TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can view their own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can update their own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can delete their own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can view public templates" ON public.site_templates;
DROP POLICY IF EXISTS "Users can manage their own templates" ON public.site_templates;

-- Policies for Sites
CREATE POLICY "Users can insert their own sites"
    ON public.sites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sites"
    ON public.sites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sites"
    ON public.sites FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites"
    ON public.sites FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for Site Templates
CREATE POLICY "Users can view public templates"
    ON public.site_templates FOR SELECT
    USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own templates"
    ON public.site_templates FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create function to update 'updated_at' on sites se não existir
CREATE OR REPLACE FUNCTION public.handle_updated_at_sites()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_update_sites ON public.sites;
CREATE TRIGGER on_update_sites
    BEFORE UPDATE ON public.sites
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at_sites();

DROP TRIGGER IF EXISTS on_update_site_templates ON public.site_templates;
CREATE TRIGGER on_update_site_templates
    BEFORE UPDATE ON public.site_templates
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at_sites();
