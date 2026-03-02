export interface Site {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    content: Record<string, any> | null;
    published_html: string | null;
    published_css: string | null;
    is_published: boolean;
    preview_image: string | null;
    created_at: string;
    updated_at: string;
}

export interface SiteTemplate {
    id: string;
    user_id: string | null;
    name: string;
    category: string;
    content: Record<string, any>;
    preview_image: string | null;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface SitePage {
    id: string;
    site_id: string;
    name: string;
    slug: string;
    content: Record<string, any> | null;
    published_html: string | null;
    published_css: string | null;
    is_home: boolean;
    created_at: string;
    updated_at: string;
}
