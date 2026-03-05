-- Materiais de Apoio (Downloads para usuários)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'geral',
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Todos podem ver materiais públicos
CREATE POLICY "Public materials are viewable by authenticated users"
    ON public.materials FOR SELECT
    USING (auth.role() = 'authenticated' AND is_public = true);

-- Dono pode gerenciar seus materiais
CREATE POLICY "Users can manage their own materials"
    ON public.materials FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER on_update_materials BEFORE UPDATE ON public.materials
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();
