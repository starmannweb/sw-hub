-- Schema para Módulo de Automações (Workflows) - Inspirado no Triia

CREATE TABLE IF NOT EXISTS public.automation_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    triggers JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de Triggers (Lógica OR)
    actions JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Array de Ações Linear
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.automation_workflows ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança
CREATE POLICY "Users can manage their workflows" ON public.automation_workflows
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Triggers de Atualização
CREATE TRIGGER on_update_automation_workflows BEFORE UPDATE ON public.automation_workflows
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();
