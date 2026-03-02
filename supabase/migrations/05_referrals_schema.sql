-- Schema para Módulo de Indicações/Afiliados (Inspirado no FBN Indica)

-- 1. Promotores (Parceiros/Afiliados vinculados a um Usuário do sistema)
CREATE TABLE IF NOT EXISTS public.referral_promoters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL, -- O usuário gestor dono do sistema que gerencia
    promoter_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Caso o promotor também tenha login no sistema
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    referral_code TEXT UNIQUE NOT NULL, -- O código único, ex: FBN000010B60
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    pix_key TEXT, -- Chave Pix para pagar o cashback
    total_earnings DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adicionar o promotor_id em crm_deals (Oportunidades de Negócio)
ALTER TABLE public.crm_deals 
ADD COLUMN promoter_id UUID REFERENCES public.referral_promoters(id) ON DELETE SET NULL;

-- 2. Indicações (Rastreamento bruto do Lead Cadastrado pelo link do Promotor)
CREATE TABLE IF NOT EXISTS public.referral_indications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL, -- O dono do sistema CRM
    promoter_id UUID REFERENCES public.referral_promoters(id) ON DELETE CASCADE NOT NULL,
    deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL, -- Vincula ao negócio lá no Kanban
    referred_name TEXT NOT NULL,
    referred_email TEXT,
    referred_phone TEXT,
    product_interest TEXT, -- Ex: Consórcio, Plano de Saúde, Criação de Site
    status TEXT NOT NULL CHECK (status IN ('pending', 'protected', 'rejected')) DEFAULT 'pending',
    commission_value DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Carteira / Recompensas (Cashback e Saques)
CREATE TABLE IF NOT EXISTS public.referral_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    promoter_id UUID REFERENCES public.referral_promoters(id) ON DELETE CASCADE NOT NULL,
    indication_id UUID REFERENCES public.referral_indications(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'withdrawal')), -- credit = Ganhou comissão, withdrawal = Sacou Pix
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'canceled')) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Habilitar RLS
ALTER TABLE public.referral_promoters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_indications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- Políticas Gestor
CREATE POLICY "Users can manage their referral_promoters" ON public.referral_promoters
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their referral_indications" ON public.referral_indications
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their referral_rewards" ON public.referral_rewards
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- Triggers para "updated_at"
CREATE TRIGGER on_update_referral_promoters BEFORE UPDATE ON public.referral_promoters
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();

CREATE TRIGGER on_update_referral_indications BEFORE UPDATE ON public.referral_indications
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at_sites();
