-- Migration for Webhook Security Definer RPC
-- Allows unauthenticated form submissions from the Builder to create Leads without breaking RLS

CREATE OR REPLACE FUNCTION public.handle_webhook_lead(
    p_page_id UUID,
    p_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_ref TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_site_id UUID;
    v_promoter_id UUID := NULL;
    v_contact_id UUID;
    v_pipeline_id UUID;
    v_stage_id UUID;
    v_deal_id UUID;
BEGIN
    -- 1. Buscar o dono do site (user_id) pela page_id
    SELECT s.user_id INTO v_user_id
    FROM public.site_pages sp
    JOIN public.sites s ON s.id = sp.site_id
    WHERE sp.id = p_page_id;

    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('error', 'Page not found');
    END IF;

    -- 2. Encontrar o Promoter (Afiliado) se a referência existir
    IF p_ref IS NOT NULL AND p_ref <> '' THEN
        SELECT id INTO v_promoter_id 
        FROM public.referral_promoters 
        WHERE referral_code = p_ref AND user_id = v_user_id 
        LIMIT 1;
    END IF;

    -- 3. Criar ou Obter o Contato
    SELECT id INTO v_contact_id FROM public.crm_contacts 
    WHERE email = p_email AND user_id = v_user_id LIMIT 1;
    
    IF v_contact_id IS NULL THEN
        INSERT INTO public.crm_contacts (user_id, type, name, email, phone, lead_score)
        VALUES (v_user_id, 'lead', p_name, p_email, p_phone, 'warm')
        RETURNING id INTO v_contact_id;
    END IF;

    -- 4. Obter o Pipeline (Kanban) Principal do Usuário
    SELECT id INTO v_pipeline_id FROM public.crm_pipelines 
    WHERE user_id = v_user_id AND is_default = true LIMIT 1;

    IF v_pipeline_id IS NOT NULL THEN
        -- Pegar o primeiro estágio do funil (ex: "Novo Lead Frio")
        SELECT id INTO v_stage_id FROM public.crm_pipeline_stages 
        WHERE pipeline_id = v_pipeline_id ORDER BY "order" ASC LIMIT 1;

        -- 5. Criar o Card de Oportunidade (Deal)
        INSERT INTO public.crm_deals (user_id, contact_id, pipeline_id, stage_id, promoter_id, title, status, value)
        VALUES (v_user_id, v_contact_id, v_pipeline_id, v_stage_id, v_promoter_id, 'Lead Captação: ' || p_name, 'open', 0)
        RETURNING id INTO v_deal_id;
        
        -- 6. Se veio de um afiliado, registrar a indicação!
        IF v_promoter_id IS NOT NULL THEN
            INSERT INTO public.referral_indications (user_id, promoter_id, deal_id, referred_name, referred_email, status, commission_value)
            VALUES (v_user_id, v_promoter_id, v_deal_id, p_name, p_email, 'pending', 0);
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'success', true, 
        'contact_id', v_contact_id, 
        'deal_id', v_deal_id, 
        'promoter_id', v_promoter_id
    );
END;
$$;
