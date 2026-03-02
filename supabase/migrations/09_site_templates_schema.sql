-- Create Site Templates Table
CREATE TABLE IF NOT EXISTS public.site_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilita RLS
ALTER TABLE public.site_templates ENABLE ROW LEVEL SECURITY;

-- Politicas Simples: Todos podem ver, todos logados podem inserir (para MVP do dev)
CREATE POLICY "Templates are viewable by everyone" 
    ON public.site_templates FOR SELECT 
    USING (true);

CREATE POLICY "Templates are insertable by authenticated users" 
    ON public.site_templates FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Templates are deletable by authenticated users" 
    ON public.site_templates FOR DELETE 
    USING (auth.role() = 'authenticated');
