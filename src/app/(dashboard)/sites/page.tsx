"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Plus, Loader2, Edit, Trash2, ExternalLink } from "lucide-react"
import { Site } from "@/types/sites"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function SitesPage() {
    const [sites, setSites] = useState<Site[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    const fetchSites = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("sites")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setSites(data || [])
        } catch (error) {
            console.error("Erro ao buscar sites:", error)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchSites()
    }, [fetchSites])

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja apagar o site "${name}"? Essa ação não pode ser desfeita.`)) return

        try {
            const { error } = await supabase.from("sites").delete().eq("id", id)
            if (error) throw error
            fetchSites()
        } catch (error) {
            console.error("Erro ao deletar site:", error)
            alert("Erro ao deletar o site.")
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Meus Sites</h2>
                    <p className="text-muted-foreground">
                        Crie landing pages, gerencie templates e publique seus projetos.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/10" onClick={() => router.push("/sites/replicate")}>
                        <Globe className="mr-2 h-4 w-4" />
                        Replicador
                    </Button>
                    <Button onClick={() => router.push("/sites/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Projeto
                    </Button>
                </div>
            </div>

            {
                loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                    </div>
                ) : sites.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-12">
                        <div className="rounded-full bg-primary/10 p-4 mb-4">
                            <Globe className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="mb-2">Nenhum site ainda</CardTitle>
                        <CardDescription className="mb-6 text-center max-w-sm">
                            Você ainda não criou nenhum site ou landing page. Clique no botão abaixo para começar usando nosso construtor.
                        </CardDescription>
                        <Button onClick={() => router.push("/sites/new")}>
                            <Plus className="mr-2 h-4 w-4" /> Criar Meu Primeiro Site
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sites.map((site) => (
                            <Card key={site.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
                                <div className="h-32 bg-muted flex items-center justify-center border-b relative">
                                    {site.preview_image ? (
                                        <img src={site.preview_image} alt={site.name} className="object-cover w-full h-full" />
                                    ) : (
                                        <Globe className="h-10 w-10 text-muted-foreground/30" />
                                    )}
                                    <div className="absolute top-2 right-2">
                                        {site.is_published ? (
                                            <Badge className="bg-green-500 hover:bg-green-600">Publicado</Badge>
                                        ) : (
                                            <Badge variant="secondary">Rascunho</Badge>
                                        )}
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl truncate">{site.name}</CardTitle>
                                    <CardDescription className="truncate text-xs">
                                        / {site.slug}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="flex justify-between border-t p-4 mt-auto">
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/sites/${site.id}`)}>
                                        <Edit className="mr-2 h-3.5 w-3.5" /> Editar Site
                                    </Button>
                                    <div className="space-x-2">
                                        {site.is_published && (
                                            <Button variant="ghost" size="icon" title="Acessar">
                                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(site.id, site.name)} title="Excluir">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )
            }
        </div >
    )
}
