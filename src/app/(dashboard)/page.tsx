import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Globe, MessageSquare, BarChart3 } from "lucide-react"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "usuário"

    const stats = [
        {
            title: "Contatos",
            value: "0",
            description: "Total de contatos",
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: "Sites",
            value: "0",
            description: "Sites publicados",
            icon: Globe,
            color: "text-green-500",
        },
        {
            title: "Conversas",
            value: "0",
            description: "Conversas ativas",
            icon: MessageSquare,
            color: "text-purple-500",
        },
        {
            title: "Visitas",
            value: "0",
            description: "Últimos 30 dias",
            icon: BarChart3,
            color: "text-orange-500",
        },
    ]

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Bem-vindo ao Hub, {firstName}! 🚀
                    </CardTitle>
                    <CardDescription className="text-base">
                        Aqui está um resumo do seu sistema. Comece explorando os módulos na barra lateral.
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader>
                        <Users className="h-8 w-8 text-blue-500 mb-2" />
                        <CardTitle className="text-lg">Adicionar Contato</CardTitle>
                        <CardDescription>
                            Cadastre um novo lead ou cliente no CRM
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader>
                        <Globe className="h-8 w-8 text-green-500 mb-2" />
                        <CardTitle className="text-lg">Criar Site</CardTitle>
                        <CardDescription>
                            Use o page builder para criar uma landing page
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader>
                        <MessageSquare className="h-8 w-8 text-purple-500 mb-2" />
                        <CardTitle className="text-lg">Iniciar Conversa</CardTitle>
                        <CardDescription>
                            Envie uma mensagem para um contato
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
