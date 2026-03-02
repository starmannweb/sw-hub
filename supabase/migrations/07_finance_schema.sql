-- Schema para Módulo de Financeiro (Faturas e Propostas) - Integrado ao CityCRM / Hub

-- 1. Propostas Comerciais (Orçamentos)
CREATE TABLE IF NOT EXISTS public.crm_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE NOT NULL,
    deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL, -- Opcional, ligado a um negócio
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
    total_value DECIMAL(12, 2) DEFAULT 0.00,
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Faturas / Cobranças (Invoices - Pix, Boleto, Cartão)
CREATE TABLE IF NOT EXISTS public.crm_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE NOT NULL,
    deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.crm_projects(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'overdue', 'canceled', 'refunded')),
    amount DECIMAL(12, 2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('pix', 'boleto', 'credit_card', 'transfer', 'cash', 'other')),
    payment_url TEXT, -- Link estático ou gerado via gateway
    pix_code TEXT, -- Copia e cola ou QRCode
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.crm_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_invoices ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (Dono dos registros)
CREATE POLICY "Users can manage their proposals" ON public.crm_proposals
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their invoices" ON public.crm_invoices
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Triggers de Atualização
CREATE TRIGGER on_update_crm_proposals BEFORE UPDATE ON public.crm_proposals
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();

CREATE TRIGGER on_update_crm_invoices BEFORE UPDATE ON public.crm_invoices
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();
