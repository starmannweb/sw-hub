"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

// Using dynamic import so GrapesJS (which alters DOM/Window heavy) ignores Server Side Rendering (SSR)
const Builder = dynamic(() => import('./components/builder'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-1 h-screen items-center justify-center bg-muted/20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Carregando construtor visual...</span>
        </div>
    )
})

export default function SiteEditorPage() {
    const params = useParams()
    const router = useRouter()
    const siteId = params.id as string
    const pageId = params.pageId as string

    // States
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [site, setSite] = useState<any>(null)
    const [error, setError] = useState("")
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    // Load Site Details from DB on mount
    useEffect(() => {
        const fetchPage = async () => {
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from("site_pages")
                    .select("*")
                    .eq("id", pageId)
                    .single()

                if (error || !data) throw new Error("Página não encontrada ou sem permissão")

                setSite(data)
                setLoading(false)
            } catch (err) {
                console.error("Erro", err)
                setError("Não foi possível carregar o ambiente de construção.")
                setLoading(false)
            }
        }
        fetchPage()
    }, [pageId])

    // Handler triggered by GrapesJS Save Command
    const handleSaveDatabase = async (projectData: any, html: string, css: string) => {
        setSaving(true)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from("site_pages")
                .update({
                    content: projectData,    // Objeto JSON master para reagendar o editor no futuro
                    published_html: html,    // Output limpo final compilado HTML
                    published_css: css,      // Output limpo final compilado CSS
                })
                .eq("id", pageId)

            if (error) throw error

            setLastSaved(new Date())
        } catch (err) {
            console.error("Erro ao salvar:", err)
            alert("Houve um erro ao salvar o projeto. Tente novamente.")
        } finally {
            setSaving(false)
        }
    }

    // Loading overlay base protection
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Autenticando e preparando painel...</p>
                </div>
            </div>
        )
    }

    // Protection missing site
    if (error || !site) {
        return (
            <div className="flex h-screen flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-2">Ops!</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => router.push(`/sites/${siteId}`)}>Voltar para o Funil</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen w-full flex-1 overflow-hidden">
            {/* The actual Builder frame injects itself here and takes over the screen */}
            <main className="flex-1 bg-muted relative w-full h-full">
                <Builder
                    initialData={site.content}
                    siteId={pageId}
                    onSave={handleSaveDatabase}
                />
            </main>
        </div>
    )
}
