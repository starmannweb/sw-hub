import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function BuilderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {children}
        </div>
    )
}
