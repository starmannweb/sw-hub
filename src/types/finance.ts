import { CrmContact, CrmDeal, CrmProject } from "./crm";

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface CrmProposal {
    id: string;
    user_id: string;
    contact_id: string;
    deal_id: string | null;
    title: string;
    description: string | null;
    status: ProposalStatus;
    total_value: number;
    valid_until: string | null;
    created_at: string;
    updated_at: string;
    crm_contacts?: Pick<CrmContact, 'name' | 'email' | 'company'>;
    crm_deals?: Pick<CrmDeal, 'title'>;
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'canceled' | 'refunded';
export type PaymentMethod = 'pix' | 'boleto' | 'credit_card' | 'transfer' | 'cash' | 'other';

export interface CrmInvoice {
    id: string;
    user_id: string;
    contact_id: string;
    deal_id: string | null;
    project_id: string | null;
    description: string;
    status: InvoiceStatus;
    amount: number;
    payment_method: PaymentMethod | null;
    payment_url: string | null;
    pix_code: string | null;
    due_date: string | null;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
    crm_contacts?: Pick<CrmContact, 'name' | 'email' | 'company'>;
    crm_projects?: Pick<CrmProject, 'name'>;
}
