import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const pageId = formData.get("page_id") as string;
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const ref = formData.get("ref") as string;
        const redirectUrl = formData.get("redirect_url") as string;

        if (!pageId || !name || !email) {
            return NextResponse.redirect(`${req.headers.get('origin') || ''}/?status=error`);
        }

        // We use the anonymous client. RLS is safely bypassed via SECURITY DEFINER function
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase.rpc('handle_webhook_lead', {
            p_page_id: pageId,
            p_name: name,
            p_email: email,
            p_phone: phone || '',
            p_ref: ref || ''
        });

        if (error) {
            console.error("RPC Webhook Error:", error);
            return NextResponse.redirect(`${redirectUrl || req.headers.get('origin') || ''}?status=error`);
        }

        return NextResponse.redirect(`${redirectUrl || req.headers.get('origin') || ''}?status=success`);
    } catch (error) {
        console.error("Server Webhook Catch Error:", error);
        return NextResponse.redirect(`${req.headers.get('origin') || ''}/?status=error`);
    }
}
