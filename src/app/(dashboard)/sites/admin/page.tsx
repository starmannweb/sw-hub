"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UploadCloud, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminTemplatesPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [category, setCategory] = useState("Marketing Agency")
    const [imageUrl, setImageUrl] = useState("")
    const [jsonFile, setJsonFile] = useState<File | null>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setJsonFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!jsonFile) {
            alert("Por favor, envie o arquivo JSON do modelo (GrapesJS Project Data).")
            return
        }

        setLoading(true)
        try {
            // Read JSON file
            const fileReader = new FileReader()
            fileReader.onload = async (event) => {
                const jsonContent = event.target?.result
                if (typeof jsonContent === "string") {
                    try {
                        const parsedJson = JSON.parse(jsonContent)

                        // Insert into Supabase
                        const { error } = await supabase
                            .from("site_templates")
                            .insert({
                                name,
                                category,
                                image_url: imageUrl || null,
                                content: parsedJson
                            })

                        if (error) {
                            console.error(error)
                            alert("Erro ao salvar no banco: " + error.message)
                        } else {
                            alert("Template adicionado com sucesso na biblioteca global!")
                            setName("")
                            setCategory("Marketing Agency")
                            setImageUrl("")
                            setJsonFile(null)
                        }
                    } catch (parseErr) {
                        alert("Arquivo JSON inválido. Verifique se o formato está correto.")
                    }
                }
                setLoading(false)
            }
            fileReader.readAsText(jsonFile)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.push("/sites")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin: Gestão de Modelos (Templates)</h2>
                    <p className="text-muted-foreground">Adicione novos temas visuais e os arquivos JSON originais na biblioteca do Hub.</p>
                </div>
            </div>

            <Card className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Adicionar Novo Modelo ao Sistema</CardTitle>
                        <CardDescription>
                            Envie a foto de pré-visualização e a estrutura JSON gerada pelo GrapesJS. O modelo ficará disponível para todos os novos sites criados no Hub.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nome do Modelo</Label>
                            <Input placeholder="Ex: VSL Alta Conversão" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Input placeholder="Ex: Fitness, Imobiliária, Finanças..." value={category} onChange={(e) => setCategory(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>URL da Imagem de Prévia (Thumb)</Label>
                            <Input placeholder="Cole o link da imagem (ex: https://...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                            {imageUrl && (
                                <div className="mt-2 w-full max-w-[200px] border border-gray-200 rounded-lg overflow-hidden h-[150px]">
                                    <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 pt-4 border-t">
                            <Label className="flex items-center gap-2">
                                <UploadCloud className="w-4 h-4 text-primary" />
                                Código do JSON Base (GrapesJS)
                            </Label>
                            <Input type="file" accept=".json" onChange={handleFileUpload} required />
                            <p className="text-xs text-muted-foreground">Você pode exportar o arquivo *.json da sua versão anterior do builder ou template original.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Registrar Novo Modelo na Biblioteca"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
