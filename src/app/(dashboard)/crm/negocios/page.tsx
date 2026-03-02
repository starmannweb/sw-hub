"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Plus, KanbanSquare, MoreHorizontal, MessageSquare,
    DollarSign, Loader2, Calendar, GripVertical
} from "lucide-react"

import type { CrmPipeline, CrmPipelineStage, CrmDeal, CrmDealStatus } from "@/types/crm"

export default function CrmDealsPage() {
    const [loading, setLoading] = useState(true)
    const [pipeline, setPipeline] = useState<CrmPipeline | null>(null)
    const [stages, setStages] = useState<CrmPipelineStage[]>([])
    const [deals, setDeals] = useState<CrmDeal[]>([])

    // Drag State
    const [draggedDealId, setDraggedDealId] = useState<string | null>(null)

    // Load Data
    const loadPipelineData = async () => {
        setLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setLoading(false)
            return
        }

        try {
            // Get or Create Default Pipeline
            let { data: pl_data } = await supabase
                .from('crm_pipelines')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true })
                .limit(1)
                .single()

            if (!pl_data) {
                const { data: pl_new, error: pl_err } = await supabase
                    .from('crm_pipelines')
                    .insert({ user_id: user.id, name: 'Vendas Principais', is_default: true })
                    .select().single()

                if (pl_err) throw pl_err
                pl_data = pl_new

                // Also generate default stages
                const defaultStages = [
                    { pipeline_id: pl_data.id, name: 'Lead Frio', order: 1, color: 'gray' },
                    { pipeline_id: pl_data.id, name: 'Oportunidade', order: 2, color: 'blue' },
                    { pipeline_id: pl_data.id, name: 'Em Negociação', order: 3, color: 'orange' },
                    { pipeline_id: pl_data.id, name: 'Fechado Ganho', order: 4, color: 'green' }
                ]
                await supabase.from('crm_pipeline_stages').insert(defaultStages)
            }

            setPipeline(pl_data)

            // Fetch pipeline stages
            const { data: stages_data } = await supabase
                .from('crm_pipeline_stages')
                .select('*')
                .eq('pipeline_id', pl_data.id)
                .order('order', { ascending: true })

            if (stages_data) setStages(stages_data)

            // Fetch active deals
            const { data: deals_data } = await supabase
                .from('crm_deals')
                .select('*')
                .eq('pipeline_id', pl_data.id)
                .neq('status', 'lost')

            if (deals_data) setDeals(deals_data)

        } catch (error) {
            console.error("Pipeline load error:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPipelineData()
    }, [])

    // HTML5 Drag Handlers
    const handleDragStart = (e: React.DragEvent, dealId: string) => {
        setDraggedDealId(dealId)
        // Set visual styling to the dragged item
        e.currentTarget.classList.add('opacity-50', 'scale-95')
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('opacity-50', 'scale-95')
        setDraggedDealId(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
        e.preventDefault()
        if (!draggedDealId) return

        // Remove from current column, put in new in UI optimistically
        const dealToMove = deals.find(d => d.id === draggedDealId)
        if (!dealToMove || dealToMove.stage_id === targetStageId) return

        setDeals(prev => prev.map(d =>
            d.id === draggedDealId ? { ...d, stage_id: targetStageId } : d
        ))

        // Update DB
        const supabase = createClient()
        const { error } = await supabase
            .from('crm_deals')
            .update({ stage_id: targetStageId })
            .eq('id', draggedDealId)

        if (error) {
            console.error(error)
            alert("Erro ao mover card no painel.")
            loadPipelineData() // Rollback UI
        }
    }

    const handleQuickAdd = async (stageId: string) => {
        const title = prompt("Qual o nome ou empresa dessa oportunidade?")
        if (!title || !pipeline) return

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const newDeal = {
            user_id: user.id,
            pipeline_id: pipeline.id,
            stage_id: stageId,
            title: title,
            status: 'open' as CrmDealStatus,
            value: 0
        }

        const { data, error } = await supabase
            .from('crm_deals')
            .insert(newDeal)
            .select()
            .single()

        if (!error && data) {
            setDeals(prev => [...prev, data])
        }
    }

    const stageColors: Record<string, string> = {
        'gray': 'bg-gray-500',
        'blue': 'bg-blue-500',
        'orange': 'bg-orange-500',
        'green': 'bg-green-500',
        'red': 'bg-red-500',
        'amber': 'bg-amber-500',
        'purple': 'bg-purple-500',
    }

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center pt-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
            <div className="flex-none p-4 md:p-8 md:pb-4 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Negócios (Pipeline)</h2>
                        <p className="text-muted-foreground">
                            {pipeline?.name || 'CRM Kanban'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Novo Negócio
                        </Button>
                    </div>
                </div>
            </div>

            {/* Kanban Board Scrolling Canvas */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 md:px-8 pb-8 pt-2">
                <div className="flex h-full gap-4 items-start">

                    {stages.map((stage) => {
                        const stageDeals = deals.filter(d => d.stage_id === stage.id)
                        const stageTotal = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0)
                        const colorClass = stageColors[stage.color || 'blue'] || 'bg-primary'

                        return (
                            <div
                                key={stage.id}
                                className="flex flex-col flex-none w-[320px] max-h-full rounded-xl bg-muted/40 border border-border/50 shadow-sm"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stage.id)}
                            >
                                {/* Stage Header */}
                                <div className="p-3 pb-2 flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-3 w-3 rounded-full ${colorClass}`}></div>
                                        <h3 className="font-semibold text-sm drop-shadow-sm">{stage.name}</h3>
                                        <span className="text-xs bg-background text-muted-foreground px-2 py-0.5 rounded-full border shadow-sm font-medium">
                                            {stageDeals.length}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>

                                <div className="px-3 pb-2 flex justify-between items-center shrink-0">
                                    <span className="text-xs text-muted-foreground font-medium">Total:</span>
                                    <span className="text-xs font-semibold">{
                                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stageTotal)
                                    }</span>
                                </div>

                                {/* Deals Scroll Area */}
                                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3 min-h-[100px] scrollbar-thin">
                                    {stageDeals.map((deal) => (
                                        <Card
                                            key={deal.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, deal.id)}
                                            onDragEnd={handleDragEnd}
                                            className="group cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md transition-all duration-200"
                                        >
                                            <CardHeader className="p-3 pb-2 flex flex-row items-start justify-between space-y-0">
                                                <div className="space-y-1 pr-2">
                                                    <CardTitle className="text-sm font-semibold leading-tight">{deal.title}</CardTitle>
                                                    <CardDescription className="text-xs">
                                                        {deal.contact_id ? 'Trocando E-mails' : 'Sem contato alvo'}
                                                    </CardDescription>
                                                </div>
                                                <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-50 transition-opacity shrink-0 cursor-move" />
                                            </CardHeader>

                                            <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs">
                                                <div className="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                                                    <DollarSign className="h-3 w-3 mr-0.5" />
                                                    {deal.value > 0 ? new Intl.NumberFormat('pt-BR', { currency: 'BRL' }).format(deal.value) : '---'}
                                                </div>
                                                <div className="flex items-center space-x-1 text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(deal.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>

                                {/* Stage Footer - Fast Add */}
                                <div className="p-3 pt-0 shrink-0">
                                    <Button
                                        onClick={() => handleQuickAdd(stage.id)}
                                        variant="ghost"
                                        className="w-full justify-start text-muted-foreground h-8 text-xs hover:bg-background"
                                    >
                                        <Plus className="mr-2 h-3 w-3" /> Adição Rápida
                                    </Button>
                                </div>
                            </div>
                        )
                    })}

                    {/* Add New Stage Column */}
                    <div className="flex-none w-[300px] shrink-0">
                        <Button variant="outline" className="w-full border-dashed bg-transparent h-12 text-muted-foreground">
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Estágio
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}
