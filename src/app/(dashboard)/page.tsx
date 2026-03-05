import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
    Users,
    Globe,
    BarChart3,
    Zap,
    FileText,
    CreditCard,
    Megaphone,
    KanbanSquare,
    Briefcase,
    GraduationCap,
    MessageCircle,
} from "lucide-react"

const features = [
    {
        title: "Leads",
        description: "Captura e gestão de contatos",
        href: "/crm/contatos",
        icon: Users,
        color: "from-emerald-600 to-emerald-800",
        iconBg: "bg-emerald-500/20 text-emerald-400",
    },
    {
        title: "CRM",
        description: "Vendas, negócios e propostas",
        href: "/crm/negocios",
        icon: KanbanSquare,
        color: "from-blue-600 to-blue-800",
        iconBg: "bg-blue-500/20 text-blue-400",
    },
    {
        title: "Projetos",
        description: "Gestão de projetos e entregas",
        href: "/colaboracao/projetos",
        icon: Briefcase,
        color: "from-violet-600 to-violet-800",
        iconBg: "bg-violet-500/20 text-violet-400",
    },
    {
        title: "Construtor de Sites",
        description: "Crie landing pages e sites",
        href: "/sites",
        icon: Globe,
        color: "from-green-600 to-green-800",
        iconBg: "bg-green-500/20 text-green-400",
    },
    {
        title: "Automações",
        description: "Fluxos automáticos e agentes de IA",
        href: "/automacoes",
        icon: Zap,
        color: "from-yellow-600 to-yellow-800",
        iconBg: "bg-yellow-500/20 text-yellow-400",
    },
    {
        title: "Indicações",
        description: "Receba indicações de parceiros",
        href: "/afiliados",
        icon: Megaphone,
        color: "from-pink-600 to-pink-800",
        iconBg: "bg-pink-500/20 text-pink-400",
    },
    {
        title: "Financeiro",
        description: "Faturamento e cobranças",
        href: "/financeiro/faturas",
        icon: CreditCard,
        color: "from-teal-600 to-teal-800",
        iconBg: "bg-teal-500/20 text-teal-400",
    },
    {
        title: "Treinamentos",
        description: "Cursos e materiais de apoio",
        href: "/treinamentos",
        icon: GraduationCap,
        color: "from-orange-600 to-orange-800",
        iconBg: "bg-orange-500/20 text-orange-400",
    },
    {
        title: "Comunidade",
        description: "Conecte-se com outros membros",
        href: "/comunidade",
        icon: MessageCircle,
        color: "from-indigo-600 to-indigo-800",
        iconBg: "bg-indigo-500/20 text-indigo-400",
    },
    {
        title: "Relatórios",
        description: "Análises e métricas do sistema",
        href: "/relatorios",
        icon: BarChart3,
        color: "from-rose-600 to-rose-800",
        iconBg: "bg-rose-500/20 text-rose-400",
    },
]

const stats = [
    { title: "LEADS ATIVOS", value: "0", icon: Users, iconBg: "bg-emerald-500/20 text-emerald-400" },
    { title: "PROJETOS EM ANDAMENTO", value: "0", icon: Briefcase, iconBg: "bg-violet-500/20 text-violet-400" },
    { title: "PROPOSTAS ENVIADAS", value: "0", icon: FileText, iconBg: "bg-amber-500/20 text-amber-400" },
    { title: "SITES PUBLICADOS", value: "0", icon: Globe, iconBg: "bg-green-500/20 text-green-400" },
]

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "usuário"

    return (
        <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/80 via-[#1a2e1a] to-[#111] border border-white/5 p-8 md:p-10">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Bem-vindo, {firstName}!
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg max-w-xl">
                        Gerencie seus leads, projetos, sites e finanças em um só lugar. Escolha um módulo abaixo para começar.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="rounded-xl bg-[#1e1e1e] border border-white/5 p-5 flex items-start justify-between"
                    >
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                {stat.title}
                            </p>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                        </div>
                        <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Modules Grid */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-1">Funcionalidades</h2>
                <p className="text-sm text-gray-500 mb-5">Acesse os serviços integrados do seu Hub</p>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {features.map((mod) => (
                        <Link
                            key={mod.title}
                            href={mod.href}
                            className="group rounded-xl bg-[#1e1e1e] border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/10"
                        >
                            <div className={`h-24 bg-gradient-to-br ${mod.color} flex items-center justify-center`}>
                                <mod.icon className="h-10 w-10 text-white/80 group-hover:scale-110 transition-transform duration-200" />
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-white mb-1">{mod.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{mod.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
