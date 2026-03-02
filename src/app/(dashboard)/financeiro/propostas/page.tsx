"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Plus, Search, Filter,
    MoreHorizontal, Calendar, FileText, Send, CheckCircle2, Clock, XCircle
} from "lucide-react"

export default function PropostasPage() {
    const supabase = createClient()
    const [search, setSearch] = useState("")
    const [propostas, setPropostas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPropostas()
    }, [])

    async function fetchPropostas() {
        setLoading(true)
        const { data: userAuth } = await supabase.auth.getUser()
        if (!userAuth.user) return

        const { data, error } = await supabase
            .from('crm_proposals')
            .select(`
                *,
                crm_contacts:contact_id ( name, company )
            `)
            .eq('user_id', userAuth.user.id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setPropostas(data)
        }
        setLoading(false)
    }

    async function handleAddProposta() {
        alert("Para gerar uma proposta precisamos ligar a um Cliente e talvez a um Negócio. Abriremos um prompt temporário de MVP.");

        const { data: userAuth } = await supabase.auth.getUser()
        if (!userAuth.user) return

        // Procura um contato pra vincular
        const { data: contatos } = await supabase.from('crm_contacts').select('id').eq('user_id', userAuth.user.id).limit(1)

        if (!contatos || contatos.length === 0) {
            alert("Aviso: Crie um Contato/Lead no CRM antes de criar propostas.")
            return;
        }

        const title = prompt("Título da Proposta:");
        if (!title) return;

        const amountStr = prompt("Valor Total (R$):");
        if (!amountStr) return;

        const { data, error } = await supabase
            .from('crm_proposals')
            .insert({
                user_id: userAuth.user.id,
                contact_id: contatos[0].id,
                title: title,
                description: 'Criação de Site Institucional 5 Páginas, Design Premium.',
                status: 'draft',
                total_value: parseFloat(amountStr),
                valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
            })
            .select(`*, crm_contacts:contact_id(name, company)`)
            .single()

        if (!error && data) {
            setPropostas([data, ...propostas])
        }
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'draft': return { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: <FileText className="w-3.5 h-3.5" />, label: 'Rascunho' };
            case 'sent': return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Send className="w-3.5 h-3.5" />, label: 'Enviada' };
            case 'accepted': return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Aprovada' };
            case 'rejected': return { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-3.5 h-3.5" />, label: 'Recusada' };
            case 'expired': return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-3.5 h-3.5" />, label: 'Expirada' };
            default: return { color: 'bg-slate-100', icon: <FileText className="w-3.5 h-3.5" />, label: status };
        }
    }

    const filteredPropostas = propostas.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.crm_contacts?.name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex-1 space-y-6 pt-6 px-4 md:px-8 max-w-7xl mx-auto w-full mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Propostas Comerciais</h2>
                    <p className="text-muted-foreground">
                        Orçamentos e contratos em negociação.
                    </p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar proposta..."
                            className="pl-8 bg-muted/40"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                    <Button onClick={handleAddProposta}><Plus className="mr-2 h-4 w-4" /> Nova Proposta</Button>
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="text-muted-foreground flex items-center gap-2"><div className="w-5 h-5 rounded-full border-t-2 border-primary animate-spin"></div> Carregando propostas...</span>
                    </div>
                ) : filteredPropostas.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg border border-dashed flex flex-col items-center">
                        <FileText className="w-12 h-12 mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-1">Nenhuma proposta encontrada</h3>
                        <p className="text-sm">Envie seu primeiro orçamento estruturado e conecte com o Kanban do CRM.</p>
                        <Button onClick={handleAddProposta} variant="outline" className="mt-4">Criar Orçamento</Button>
                    </div>
                ) : (
                    <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-muted-foreground border-b bg-muted/20 uppercase tracking-wider hidden md:grid">
                            <div className="col-span-4">Cliente & Título</div>
                            <div className="col-span-2 text-center">Valor Total</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-3 text-center">Validade</div>
                            <div className="col-span-1 border-0"></div>
                        </div>

                        <div className="divide-y">
                            {filteredPropostas.map(proposta => {
                                const status = getStatusInfo(proposta.status)
                                const isExpired = new Date(proposta.valid_until) < new Date() && proposta.status !== 'accepted' && proposta.status !== 'rejected'

                                return (
                                    <div key={proposta.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors group">
                                        <div className="col-span-1 md:col-span-4 flex flex-col">
                                            <span className="font-semibold text-primary">{proposta.title}</span>
                                            <span className="text-sm text-muted-foreground flex items-center mt-1">
                                                {proposta.crm_contacts?.name || 'Cliente Sem Nome'}
                                                {proposta.crm_contacts?.company && <span className="ml-1 px-1.5 py-0.5 bg-muted rounded text-[10px]">{proposta.crm_contacts.company}</span>}
                                            </span>
                                        </div>

                                        <div className="col-span-1 md:col-span-2 md:text-center font-bold text-lg md:text-base">
                                            {formatCurrency(proposta.total_value)}
                                        </div>

                                        <div className="col-span-1 md:col-span-2 md:text-center flex justify-start md:justify-center">
                                            <Badge variant="outline" className={`flex w-fit items-center gap-1.5 px-2.5 py-1 ${isExpired ? getStatusInfo('expired').color : status.color}`}>
                                                {isExpired ? getStatusInfo('expired').icon : status.icon}
                                                {isExpired ? 'Expirada' : status.label}
                                            </Badge>
                                        </div>

                                        <div className="col-span-1 md:col-span-3 text-sm text-muted-foreground md:text-center flex items-center justify-start md:justify-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {proposta.valid_until ? new Date(proposta.valid_until).toLocaleDateString() : 'Sem validade'}
                                            {isExpired && <span className="text-red-500 font-medium text-xs ml-1">(Vencida)</span>}
                                        </div>

                                        <div className="col-span-1 flex justify-end">
                                            <Button variant="ghost" size="sm" className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                                Abrir <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
