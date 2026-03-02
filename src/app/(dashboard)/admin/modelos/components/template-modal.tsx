"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"


interface SiteTemplate {
    id: string
    name: string
    category: string
    content: any
    preview_image: string | null
    is_public: boolean
}

interface TemplateModalProps {
    isOpen: boolean
    onClose: () => void
    onSaved: () => void
    template?: SiteTemplate
}

export function TemplateModal({ isOpen, onClose, onSaved, template }: TemplateModalProps) {
    const supabase = createClient()

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [previewImage, setPreviewImage] = useState("")
    const [isPublic, setIsPublic] = useState(true)
    const [jsonContent, setJsonContent] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (template) {
            setName(template.name)
            setCategory(template.category)
            setPreviewImage(template.preview_image || "")
            setIsPublic(template.is_public)
            setJsonContent(JSON.stringify(template.content, null, 2))
        } else {
            resetForm()
        }
    }, [template, isOpen])

    const resetForm = () => {
        setName("")
        setCategory("")
        setPreviewImage("")
        setIsPublic(true)
        setJsonContent("")
    }

    const handleSave = async () => {
        if (!name || !category || !jsonContent) {
            alert("Por favor, preencha os campos obrigatórios (Nome, Categoria e JSON).")
            return
        }

        let parsedContent = null
        try {
            parsedContent = JSON.parse(jsonContent)
        } catch (error) {
            alert("O JSON inserido é inválido. Por favor, verifique a sintaxe.")
            return
        }

        setIsSaving(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user?.id) {
                alert("Você precisa estar logado.")
                return
            }

            const modelData = {
                name,
                category,
                content: parsedContent,
                preview_image: previewImage || null,
                is_public: isPublic,
                user_id: session.user.id
            }

            if (template?.id) {
                // Update
                const { error } = await supabase
                    .from("site_templates")
                    .update(modelData)
                    .eq("id", template.id)

                if (error) throw error
                alert("Modelo atualizado com sucesso!")
            } else {
                // Insert
                const { error } = await supabase
                    .from("site_templates")
                    .insert([modelData])

                if (error) throw error
                alert("Modelo criado com sucesso!")
            }

            onSaved()
            onClose()
            resetForm()
        } catch (error) {
            console.error("Erro ao salvar modelo:", error)
            alert("Ocorreu um erro ao salvar o modelo.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{template ? "Editar Modelo" : "Novo Modelo"}</DialogTitle>
                    <DialogDescription>
                        Preencha os detalhes e cole a biblioteca JSON no campo abaixo.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Modelo *</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Landing Page Tech"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria *</Label>
                            <Input
                                id="category"
                                placeholder="Ex: Tecnologia, Vendas, Portfólio"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="preview">URL da Imagem de Preview</Label>
                        <Input
                            id="preview"
                            placeholder="https://exemplo.com/imagem.png"
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_public"
                            checked={isPublic}
                            onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                        />
                        <Label htmlFor="is_public" className="font-normal cursor-pointer">
                            Tornar este modelo público (disponível para outros usuários da plataforma)
                        </Label>
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col">
                        <Label htmlFor="jsonContent">Conteúdo JSON (GrapesJS) *</Label>
                        <Textarea
                            id="jsonContent"
                            className="flex-1 font-mono text-xs whitespace-pre"
                            placeholder='{&#10;  "assets": [],&#10;  "styles": [],&#10;  "pages": [],&#10;  ...&#10;}'
                            value={jsonContent}
                            onChange={(e) => setJsonContent(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar Modelo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
