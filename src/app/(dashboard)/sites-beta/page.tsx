"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

// Using dynamic import so GrapesJS (which alters DOM/Window heavy) ignores Server Side Rendering (SSR)
const Builder = dynamic(() => import('./components/builder'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-1 h-screen items-center justify-center bg-muted/20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Carregando construtor clássico...</span>
        </div>
    )
})

export default function SitesBetaPage() {
    const router = useRouter()

    // Handler — Builder Clássico não salva no banco automaticamente, só permite exportar JSON
    const handleSaveDatabase = async (projectData: any, html: string, css: string) => {
        // Download JSON export  
        const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'projeto-swhub.json'
        a.click()
        URL.revokeObjectURL(url)
        alert("Projeto exportado com sucesso! Para salvar no banco, use o Construtor Principal via Meus Sites.")
    }

    return (
        <div className="flex flex-col h-screen w-full flex-1 overflow-hidden">
            <main className="flex-1 bg-muted relative w-full h-full">
                <Builder
                    initialData={null}
                    onSave={handleSaveDatabase}
                />
            </main>
        </div>
    )
}
