export type ContactStatus = 'active' | 'inactive' | 'lead' | 'customer';

export interface Contact {
    id: string;
    first_name: string;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    source: string | null;
    status: ContactStatus;
    tags: string[] | null;
    metadata: Record<string, any>;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
    user_id: string;
}

export interface ContactNote {
    id: string;
    contact_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export interface CustomField {
    id: string;
    user_id: string;
    name: string;
    field_key: string;
    field_type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
    options: string[] | null;
    required: boolean;
    sort_order: number;
}

// Modelagem Baseada no CityCRM (Próxima Geração do Hub)

export type CrmContactType = 'lead' | 'client';
export type CrmLeadScore = 'cold' | 'warm' | 'hot' | null;

export interface CrmContact {
    id: string;
    user_id: string;
    type: CrmContactType;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    job_title: string | null;
    lead_score: CrmLeadScore;
    tags: string[] | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CrmPipeline {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface CrmPipelineStage {
    id: string;
    pipeline_id: string;
    name: string;
    order: number;
    color: string | null;
    created_at: string;
    updated_at: string;
}

export type CrmDealStatus = 'open' | 'won' | 'lost';

export interface CrmDeal {
    id: string;
    user_id: string;
    contact_id: string | null;
    pipeline_id: string;
    stage_id: string;
    promoter_id?: string | null; // Integrado com o programa FBN Indica
    title: string;
    value: number;
    status: CrmDealStatus;
    expected_close_date: string | null;
    created_at: string;
    updated_at: string;
}

export type CrmProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'canceled';

export interface CrmProject {
    id: string;
    user_id: string;
    contact_id: string | null;
    name: string;
    description: string | null;
    status: CrmProjectStatus;
    budget: number;
    start_date: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export type CrmTaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type CrmTaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface CrmTask {
    id: string;
    user_id: string;
    project_id: string | null;
    contact_id: string | null;
    title: string;
    description: string | null;
    priority: CrmTaskPriority;
    status: CrmTaskStatus;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}
