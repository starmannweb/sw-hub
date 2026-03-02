import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function ConfiguracoesPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
                    <p className="text-muted-foreground">
                        Ajustes da conta e do sistema.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" /> Em construção
                    </CardTitle>
                    <CardDescription>
                        Este módulo está sendo desenvolvido e em breve estará disponível.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground border-t">
                    Página em construção...
                </CardContent>
            </Card>
        </div>
    )
}
