"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
    ShieldCheck, LayoutTemplate, Download, Users, Globe, KanbanSquare,
    FileText, CreditCard, ArrowRight, Loader2, BarChart3, Settings,
    GraduationCap, Megaphone,
} from "lucide-react"

type AdminStats = {
    totalUsers: number
    totalSites: number
    totalDeals: number
    totalTemplates: number
    totalMaterials: number
    totalProposals: number
}

const adminModules = [
    {
        title: "Modelos de Sites",
        description: "Gerenciar templates disponíveis para usuários",
        href: "/admin/modelos",
        icon: LayoutTemplate,
        color: "bg-violet-500/15 text-violet-400",
    },
    {
        title: "Materiais de Apoio",
        description: "Upload e gestão de arquivos para download",
        href: "/admin/materiais",
        icon: Download,
        color: "bg-purple-500/15 text-purple-400",
    },
    {
        title: "Gerenciar Usuários",
        description: "Visualizar e administrar contas de usuários",
        href: "/admin/usuarios",
        icon: Users,
        color: "bg-blue-500/15 text-blue-400",
    },
    {
        title: "Sites Publicados",
        description: "Monitorar todos os sites publicados na plataforma",
        href: "/admin/sites",
        icon: Globe,
        color: "bg-fuchsia-500/15 text-fuchsia-400",
    },
    {
        title: "Pipelines & CRM",
        description: "Visão geral de pipelines e negócios dos usuários",
        href: "/admin/crm",
        icon: KanbanSquare,
        color: "bg-indigo-500/15 text-indigo-400",
    },
    {
        title: "Treinamentos",
        description: "Gerenciar vídeo-aulas e conteúdos educativos",
        href: "/admin/treinamentos",
        icon: GraduationCap,
        color: "bg-orange-500/15 text-orange-400",
    },
    {
        title: "Indicações",
        description: "Visualizar indicações e NPS dos clientes",
        href: "/admin/indicacoes",
        icon: Megaphone,
        color: "bg-pink-500/15 text-pink-400",
    },
    {
        title: "Configurações do Sistema",
        description: "Planos, limites, variáveis e integrações globais",
        href: "/admin/config",
        icon: Settings,
        color: "bg-gray-500/15 text-gray-400",
    },
]

export default function AdminPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        totalSites: 0,
        totalDeals: 0,
        totalTemplates: 0,
        totalMaterials: 0,
        totalProposals: 0,
    })

    useEffect(() => {
        async function fetchStats() {
            try {
                const [
                    { count: usersCount },
                    { count: sitesCount },
                    { count: dealsCount },
                    { count: templatesCount },
                    { count: materialsCount },
                    { count: proposalsCount },
                ] = await Promise.all([
                    supabase.from("profiles").select("*", { count: "exact", head: true }),
                    supabase.from("sites").select("*", { count: "exact", head: true }),
                    supabase.from("crm_deals").select("*", { count: "exact", head: true }),
                    supabase.from("site_templates").select("*", { count: "exact", head: true }),
                    supabase.from("materials").select("*", { count: "exact", head: true }),
                    supabase.from("crm_proposals").select("*", { count: "exact", head: true }),
                ])

                setStats({
                    totalUsers: usersCount || 0,
                    totalSites: sitesCount || 0,
                    totalDeals: dealsCount || 0,
                    totalTemplates: templatesCount || 0,
                    totalMaterials: materialsCount || 0,
                    totalProposals: proposalsCount || 0,
                })
            } catch (err) {
                console.error("Admin stats error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const statCards = [
        { title: "Usuários", value: stats.totalUsers, icon: Users, color: "bg-violet-500/15 text-violet-400" },
        { title: "Sites", value: stats.totalSites, icon: Globe, color: "bg-fuchsia-500/15 text-fuchsia-400" },
        { title: "Negócios", value: stats.totalDeals, icon: KanbanSquare, color: "bg-blue-500/15 text-blue-400" },
        { title: "Templates", value: stats.totalTemplates, icon: LayoutTemplate, color: "bg-purple-500/15 text-purple-400" },
        { title: "Materiais", value: stats.totalMaterials, icon: Download, color: "bg-indigo-500/15 text-indigo-400" },
        { title: "Propostas", value: stats.totalProposals, icon: FileText, color: "bg-pink-500/15 text-pink-400" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-violet-600/20">
                    <ShieldCheck className="h-7 w-7 text-violet-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
                    <p className="text-sm text-gray-500">Gerencie toda a plataforma a partir daqui</p>
                </div>
            </div>

            {/* Stats */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {statCards.map((stat) => (
                        <div key={stat.title} className="rounded-xl bg-[#12142a] border border-white/[0.06] p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</span>
                                <div className={`p-1.5 rounded-lg ${stat.color}`}>
                                    <stat.icon className="h-3.5 w-3.5" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Admin Modules Grid */}
            <div>
                <h2 className="text-sm font-bold text-white mb-1">Módulos de Administração</h2>
                <p className="text-xs text-gray-500 mb-4">Acesse as ferramentas de gestão da plataforma</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {adminModules.map((mod) => (
                        <Link
                            key={mod.title}
                            href={mod.href}
                            className="group flex items-start gap-4 p-5 rounded-xl bg-[#12142a] border border-white/[0.06] hover:border-violet-500/20 transition-all"
                        >
                            <div className={`p-2.5 rounded-xl shrink-0 ${mod.color}`}>
                                <mod.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white mb-0.5">{mod.title}</p>
                                <p className="text-[11px] text-gray-500 leading-relaxed">{mod.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-700 group-hover:text-violet-400 transition-colors shrink-0 mt-1" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
