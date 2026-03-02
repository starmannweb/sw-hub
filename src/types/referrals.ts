export type PromoterStatus = 'active' | 'inactive' | 'suspended';
export type IndicationStatus = 'pending' | 'protected' | 'rejected';
export type RewardType = 'credit' | 'withdrawal';
export type RewardStatus = 'pending' | 'completed' | 'canceled';

export interface ReferralPromoter {
    id: string;
    user_id: string; // Admin owner
    promoter_user_id: string | null; // Logged-in promoter
    name: string;
    email: string | null;
    phone: string | null;
    referral_code: string;
    status: PromoterStatus;
    pix_key: string | null;
    total_earnings: number;
    created_at: string;
    updated_at: string;
}

export interface ReferralIndication {
    id: string;
    user_id: string;
    promoter_id: string;
    deal_id: string | null;
    referred_name: string;
    referred_email: string | null;
    referred_phone: string | null;
    product_interest: string | null;
    status: IndicationStatus;
    commission_value: number;
    created_at: string;
    updated_at: string;
}

export interface ReferralReward {
    id: string;
    user_id: string;
    promoter_id: string;
    indication_id: string | null;
    type: RewardType;
    amount: number;
    description: string | null;
    status: RewardStatus;
    created_at: string;
}
