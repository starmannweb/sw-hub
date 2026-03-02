"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    first_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    last_name: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    company: z.string().optional(),
    status: z.enum(["active", "inactive", "lead", "customer"]),
    source: z.string().optional(),
})

import { Contact } from "@/types/crm"

interface ContactModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    initialData?: Contact | null
}

export function ContactModal({ isOpen, onClose, onSuccess, initialData }: ContactModalProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: initialData?.first_name || "",
            last_name: initialData?.last_name || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            company: initialData?.company || "",
            status: initialData?.status || "lead",
            source: initialData?.source || "",
        },
    })

    // Reset form values when modal opens or initialData changes
    useState(() => {
        if (isOpen) {
            form.reset({
                first_name: initialData?.first_name || "",
                last_name: initialData?.last_name || "",
                email: initialData?.email || "",
                phone: initialData?.phone || "",
                company: initialData?.company || "",
                status: initialData?.status || "lead",
                source: initialData?.source || "",
            })
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true)

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Usuário não autenticado")

            if (initialData) {
                // Modo Edição
                const { error } = await supabase
                    .from("contacts")
                    .update(values)
                    .eq("id", initialData.id)

                if (error) throw error
            } else {
                // Modo Criação
                const { error } = await supabase.from("contacts").insert({
                    ...values,
                    user_id: user.id,
                })

                if (error) throw error
            }

            onSuccess()
            form.reset()
            onClose()
        } catch (error: any) {
            console.error("Erro ao salvar contato:", error)
            alert("Erro ao salvar contato: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Contato" : "Novo Contato"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Atualize as informações do contato." : "Insira as informações do novo lead ou cliente."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: João" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Sobrenome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Silva" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="joao@exemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="(11) 99999-9999" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Empresa</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome da empresa" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="lead">Lead</SelectItem>
                                                <SelectItem value="active">Ativo</SelectItem>
                                                <SelectItem value="customer">Cliente</SelectItem>
                                                <SelectItem value="inactive">Inativo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Origem</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Instagram, Indicação" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Contato
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
