-- Adicionar campo "source" (origem do lead/deal)

ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS source TEXT CHECK (source IN ('ads', 'indicacao', 'organico', 'whatsapp', 'site', 'outro'));
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS source TEXT CHECK (source IN ('ads', 'indicacao', 'organico', 'whatsapp', 'site', 'outro'));
