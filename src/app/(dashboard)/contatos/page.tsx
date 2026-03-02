"use client"

import { useEffect, useState, useCallback } from "react"
import { Plus, Download, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Contact } from "@/types/crm"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { ContactModal } from "@/components/modals/contact-modal"

export default function ContatosPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const supabase = createClient()

    const fetchContacts = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("contacts")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setContacts(data || [])
        } catch (error) {
            console.error("Erro ao buscar contatos:", error)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchContacts()
    }, [fetchContacts])

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Contatos</h2>
                    <p className="text-muted-foreground">
                        Gerencie seus leads e clientes em um só lugar.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Importar
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                    <Button size="sm" onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Contato
                    </Button>
                </div>
            </div>

            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => fetchContacts()}
            />

            <Card>
                <CardHeader className="px-6">
                    <CardTitle>Todos os Contatos</CardTitle>
                    <CardDescription>
                        Uma lista de todos os contatos no seu CRM.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={contacts}
                            searchKey="name"
                            placeholder="Buscar por nome..."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
