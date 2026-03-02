-- Create Site Pages table
CREATE TABLE IF NOT EXISTS public.site_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    content JSONB,
    published_html TEXT,
    published_css TEXT,
    is_home BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(site_id, slug) -- Previne duas paginas com a mesma rota /slug dentro do mesmo site
);

-- Habilita RLS para a nova tabela
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- Politicas de Seguranca (Herda indiretamente pelo site_id que pertence ao user na view)

-- Select: Usuário pode ver as paginas dos sites que pertencem a ele
CREATE POLICY "Users can view pages of their sites"
    ON public.site_pages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.sites 
            WHERE sites.id = site_pages.site_id 
            AND sites.user_id = auth.uid()
        )
    );

-- Insert: Usuário pode inserir paginas nos sites que pertencem a ele
CREATE POLICY "Users can insert pages to their sites"
    ON public.site_pages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.sites 
            WHERE sites.id = site_pages.site_id 
            AND sites.user_id = auth.uid()
        )
    );

-- Update: Usuário pode editar paginas nos sites que pertencem a ele
CREATE POLICY "Users can update pages of their sites"
    ON public.site_pages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.sites 
            WHERE sites.id = site_pages.site_id 
            AND sites.user_id = auth.uid()
        )
    );

-- Delete: Usuário pode deletar paginas nos sites que pertencem a ele
CREATE POLICY "Users can delete pages of their sites"
    ON public.site_pages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.sites 
            WHERE sites.id = site_pages.site_id 
            AND sites.user_id = auth.uid()
        )
    );

-- Trigger para atualizar o campo updated_at automaticamente
DROP TRIGGER IF EXISTS on_update_site_pages ON public.site_pages;
CREATE TRIGGER on_update_site_pages
    BEFORE UPDATE ON public.site_pages
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at_sites();
