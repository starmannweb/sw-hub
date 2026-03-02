-- Schema para Módulo de CRM (Vendas e Colaboração) - Inspirado no CityCRM

-- 1. Contatos (Unificando Leads e Clientes)
CREATE TABLE IF NOT EXISTS public.crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('lead', 'client')),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    lead_score TEXT CHECK (lead_score IN ('cold', 'warm', 'hot')), -- Apenas para leads
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Pipelines (Funis de Vendas)
CREATE TABLE IF NOT EXISTS public.crm_pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Estágios do Funil (Pipeline Stages)
CREATE TABLE IF NOT EXISTS public.crm_pipeline_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID REFERENCES public.crm_pipelines(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Negócios (Deals - Oportunidades no Quadro Kanban)
CREATE TABLE IF NOT EXISTS public.crm_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
    pipeline_id UUID REFERENCES public.crm_pipelines(id) ON DELETE CASCADE NOT NULL,
    stage_id UUID REFERENCES public.crm_pipeline_stages(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    value DECIMAL(12, 2) DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('open', 'won', 'lost')),
    expected_close_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Projetos (Pós-Venda / Colaboração)
CREATE TABLE IF NOT EXISTS public.crm_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL, -- Cliente associado
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'canceled')),
    budget DECIMAL(12, 2) DEFAULT 0.00,
    start_date DATE,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tarefas (Tasks)
CREATE TABLE IF NOT EXISTS public.crm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.crm_projects(id) ON DELETE CASCADE, -- Pode ser nulo se for tarefa avulsa
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL, -- Opcional
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Habilitar Row Level Security (RLS)
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança genéricas para donos dos registros (user_id = auth.uid())

-- Contatos
CREATE POLICY "Users can manage their contacts" ON public.crm_contacts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Pipelines
CREATE POLICY "Users can manage their pipelines" ON public.crm_pipelines
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Pipeline Stages (Acesso via pipeline dono)
CREATE POLICY "Users can manage stages of their pipelines" ON public.crm_pipeline_stages
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.crm_pipelines WHERE id = pipeline_id AND user_id = auth.uid())
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.crm_pipelines WHERE id = pipeline_id AND user_id = auth.uid())
    );

-- Deals
CREATE POLICY "Users can manage their deals" ON public.crm_deals
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Projetos
CREATE POLICY "Users can manage their projects" ON public.crm_projects
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Tarefas
CREATE POLICY "Users can manage their tasks" ON public.crm_tasks
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- Triggers para "updated_at"
CREATE TRIGGER on_update_crm_contacts BEFORE UPDATE ON public.crm_contacts
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();

CREATE TRIGGER on_update_crm_pipelines BEFORE UPDATE ON public.crm_pipelines
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();

CREATE TRIGGER on_update_crm_pipeline_stages BEFORE UPDATE ON public.crm_pipeline_stages
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();

CREATE TRIGGER on_update_crm_deals BEFORE UPDATE ON public.crm_deals
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();

CREATE TRIGGER on_update_crm_projects BEFORE UPDATE ON public.crm_projects
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();

CREATE TRIGGER on_update_crm_tasks BEFORE UPDATE ON public.crm_tasks
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();
