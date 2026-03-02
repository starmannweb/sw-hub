"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Contact } from "@/types/crm"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Mail, Phone, Building, Globe, MapPin, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ContactModal } from "@/components/modals/contact-modal"
import { ContactNotes } from "./components/contact-notes"

export default function ContactDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [contact, setContact] = useState<Contact | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const supabase = createClient()

    const fetchContact = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("contacts")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            setContact(data)
        } catch (error) {
            console.error("Erro ao buscar detalhes do contato:", error)
        } finally {
            setLoading(false)
        }
    }, [id, supabase])

    useEffect(() => {
        fetchContact()
    }, [fetchContact])

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Skeleton className="h-10 w-[200px]" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="md:col-span-1">
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                    <div className="md:col-span-2">
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (!contact) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <h2 className="text-xl font-bold">Contato não encontrado</h2>
                <Button variant="link" onClick={() => router.push("/contatos")}>Voltar para contatos</Button>
            </div>
        )
    }

    const firstChar = contact.first_name ? contact.first_name[0].toUpperCase() : "C"

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/contatos")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Detalhes do Contato</h2>
            </div>

            <ContactModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => fetchContact()}
                initialData={contact}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Coluna Esquerda: Perfil */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="text-center pb-2">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="" alt={contact.first_name || ""} />
                                    <AvatarFallback className="text-3xl">{firstChar}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-2xl">{contact.first_name} {contact.last_name}</CardTitle>
                            <CardDescription className="flex items-center justify-center space-x-2">
                                <Badge className="capitalize" variant="secondary">{contact.status}</Badge>
                            </CardDescription>
                            <div className="mt-4">
                                <Button className="w-full" variant="outline" onClick={() => setIsEditModalOpen(true)}>
                                    <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Separator className="my-4" />
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sobre</h3>
                                {contact.email && (
                                    <div className="flex items-center text-sm">
                                        <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                                        <span>{contact.email}</span>
                                    </div>
                                )}
                                {contact.phone && (
                                    <div className="flex items-center text-sm">
                                        <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                                        <span>{contact.phone}</span>
                                    </div>
                                )}
                                {contact.company && (
                                    <div className="flex items-center text-sm">
                                        <Building className="h-4 w-4 mr-3 text-muted-foreground" />
                                        <span>{contact.company}</span>
                                    </div>
                                )}
                                {contact.source && (
                                    <div className="flex items-center text-sm">
                                        <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                                        <span>Origem: {contact.source}</span>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-4" />
                            <div className="space-y-4">
                                <h3 className="flex items-center justify-between text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    <span>Tags</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Tag className="h-3 w-3" />
                                    </Button>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(contact.tags && contact.tags.length > 0) ? (
                                        contact.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Nenhuma tag.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Direita: Abas (Tabs) */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="timeline" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="timeline">Timeline / Notas</TabsTrigger>
                            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                            <TabsTrigger value="files">Arquivos</TabsTrigger>
                        </TabsList>

                        <TabsContent value="timeline" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Timeline</CardTitle>
                                    <CardDescription>
                                        Adicione notas e veja o histórico de atividades deste contato.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ContactNotes contactId={contact.id} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="tasks" className="mt-6">
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    Em breve: Gerenciamento de tarefas associadas ao contato.
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="files" className="mt-6">
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    Em breve: Upload de arquivos e documentos do contato.
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
