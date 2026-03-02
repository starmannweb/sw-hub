"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Search, Filter } from "lucide-react"

export default function CrmContactsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leads e Clientes</h2>
                    <p className="text-muted-foreground">
                        Liste e gerencie sua base de contatos.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Novo Contato
                    </Button>
                </div>
            </div>

            <Card className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mb-2">Módulo em Construção</CardTitle>
                <CardDescription className="mb-6 text-center max-w-sm">
                    A estrutura do banco de dados (tabela crm_contacts) já foi criada.
                    Em breve os formulários e a tabela de dados inteligentes (Smart Lists) aparecerão aqui.
                </CardDescription>
            </Card>
        </div>
    )
}
