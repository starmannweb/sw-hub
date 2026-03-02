"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Plus, Search, Filter,
    MoreHorizontal, Calendar, CheckSquare, Loader2
} from "lucide-react"
import { CrmProject } from "@/types/crm"

export default function ProjetosPage() {
    const supabase = createClient()
    const [search, setSearch] = useState("")
    const [projetos, setProjetos] = useState<CrmProject[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProjetos()
    }, [])

    async function fetchProjetos() {
        setLoading(true)
        const { data: userAuth } = await supabase.auth.getUser()
        if (!userAuth.user) return

        const { data, error } = await supabase
            .from('crm_projects')
            .select('*')
            .eq('user_id', userAuth.user.id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setProjetos(data)
        }
        setLoading(false)
    }

    async function handleAddProject() {
        const title = prompt("Digite o nome do novo projeto:");
        if (!title) return;

        const { data: userAuth } = await supabase.auth.getUser()
        if (!userAuth.user) return

        const { data, error } = await supabase
            .from('crm_projects')
            .insert({
                user_id: userAuth.user.id,
                name: title,
                status: 'planning',
                budget: 0,
            })
            .select()
            .single()

        if (!error && data) {
            setProjetos([data, ...projetos])
        }
    }

    const filteredProjetos = projetos.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="flex-1 space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
                    <p className="text-muted-foreground">
                        Gestão e execução de entregáveis pós-venda.
                    </p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar projeto..."
                            className="pl-8 bg-muted/40"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                    <Button onClick={handleAddProject}><Plus className="mr-2 h-4 w-4" /> Novo Projeto</Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjetos.map(projeto => {
                        // Dummy UI calc for now
                        const isCompleted = projeto.status === 'completed'
                        const progresso = isCompleted ? 100 : (projeto.status === 'active' ? 50 : 10)
                        const cor = isCompleted ? 'bg-emerald-500' : (projeto.status === 'active' ? 'bg-blue-500' : 'bg-slate-400')

                        return (
                            <Card key={projeto.id} className="group hover:border-primary/50 transition-all shadow-sm">
                                <CardHeader className="pb-3 border-b border-muted/50">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1 pr-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${cor}`} />
                                                <CardTitle className="text-lg leading-tight">{projeto.name}</CardTitle>
                                            </div>
                                            <CardDescription>{projeto.description || "Sem descrição"}</CardDescription>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mr-2">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 pb-2 space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground font-medium flex items-center">
                                                <CheckSquare className="w-3.5 h-3.5 mr-1" /> Tarefas
                                            </span>
                                            <span className="font-semibold">{progresso}%</span>
                                        </div>
                                        <Progress value={progresso} className="h-2" />
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            {projeto.due_date ? new Date(projeto.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Sem prazo'}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    {/* Card de Adição */}
                    <Card onClick={handleAddProject} className="flex flex-col items-center justify-center text-muted-foreground bg-muted/20 border-dashed hover:bg-muted/40 hover:text-primary transition-colors cursor-pointer min-h-[200px]">
                        <div className="rounded-full bg-muted/50 p-3 mb-2">
                            <Plus className="h-6 w-6" />
                        </div>
                        <span className="font-semibold text-sm">Criar um Projeto</span>
                    </Card>
                </div>
            )}
        </div>
    )
}
