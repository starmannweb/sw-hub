"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    Globe,
    MessageSquare,
    BarChart3,
    Settings,
    Zap,
    LayoutTemplate,
    KanbanSquare,
    Briefcase,
    CheckSquare,
    FileText,
    CreditCard,
    Megaphone,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react"

const navGroups = [
    {
        title: "Principal",
        items: [
            { title: "Dashboard", href: "/", icon: LayoutDashboard },
            { title: "Conversas", href: "/conversas", icon: MessageSquare },
        ]
    },
    {
        title: "CRM",
        items: [
            { title: "Leads e Clientes", href: "/crm/contatos", icon: Users },
            { title: "Negócios", href: "/crm/negocios", icon: KanbanSquare },
        ]
    },
    {
        title: "Colaboração",
        items: [
            { title: "Projetos", href: "/colaboracao/projetos", icon: Briefcase },
            { title: "Tarefas", href: "/colaboracao/tarefas", icon: CheckSquare },
        ]
    },
    {
        title: "Financeiro",
        items: [
            { title: "Propostas", href: "/financeiro/propostas", icon: FileText },
            { title: "Faturas", href: "/financeiro/faturas", icon: CreditCard },
        ]
    },
    {
        title: "Marketing & Parceiros",
        items: [
            { title: "Construtor de Sites", href: "/sites", icon: Globe },
            { title: "Builder Clássico", href: "/sites-beta", icon: LayoutTemplate },
            { title: "Programa de Indicações", href: "/afiliados", icon: Megaphone },
            { title: "Automações", href: "/automacoes", icon: Zap },
        ]
    },
    {
        title: "Outros",
        items: [
            { title: "Relatórios", href: "/relatorios", icon: BarChart3 },
            { title: "Configurações", href: "/configuracoes", icon: Settings },
            { title: "Modelos (Admin)", href: "/admin/modelos", icon: LayoutTemplate },
        ]
    }
]

export function Sidebar() {
    const pathname = usePathname()
    // Start expanded by default, or you can manage this via context/localstorage later
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <aside className={cn(
            "hidden md:flex h-screen flex-col border-r bg-card overflow-y-auto transition-all duration-300 ease-in-out z-40",
            isCollapsed ? "w-[72px]" : "w-64"
        )}>
            {/* Logo & Toggle */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b px-4 sticky top-0 bg-card z-10">
                <div className={cn("flex items-center gap-2 overflow-hidden", isCollapsed && "w-0 opacity-0")}>
                    <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <span className="text-sm font-bold text-primary-foreground">H</span>
                    </div>
                    <span className="text-lg font-semibold whitespace-nowrap">SWHub</span>
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn("p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors shrink-0", isCollapsed && "mx-auto")}
                    title={isCollapsed ? "Expandir" : "Recolher"}
                >
                    {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className={cn("flex-1 space-y-6 py-6", isCollapsed ? "px-2" : "px-3")}>
                {navGroups.map((group, groupIdx) => (
                    <div key={groupIdx}>
                        {!isCollapsed ? (
                            <h4 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                {group.title}
                            </h4>
                        ) : (
                            <div className="h-px bg-border/50 my-4 mx-2"></div>
                        )}

                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/" && pathname.startsWith(item.href))

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={isCollapsed ? item.title : undefined}
                                        className={cn(
                                            "flex items-center rounded-lg transition-colors overflow-hidden",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                            isCollapsed ? "justify-center p-2.5 mx-auto w-10 h-10" : "gap-3 px-3 py-2 w-full text-sm font-medium"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        {!isCollapsed && <span className="whitespace-nowrap">{item.title}</span>}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="border-t p-4 shrink-0 mt-auto sticky bottom-0 bg-card overflow-hidden">
                {!isCollapsed ? (
                    <p className="text-xs text-muted-foreground text-center whitespace-nowrap">
                        SWHub v0.3.0
                    </p>
                ) : (
                    <div className="w-full flex justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                    </div>
                )}
            </div>
        </aside>
    )
}
