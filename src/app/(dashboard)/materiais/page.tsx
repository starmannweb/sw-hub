"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Download, FileText, Image, FileArchive, Film, Loader2, Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"

type Material = {
    id: string
    title: string
    description: string | null
    category: string
    file_url: string
    file_type: string | null
    file_size: number | null
    thumbnail_url: string | null
    download_count: number
    created_at: string
}

const fileTypeIcons: Record<string, React.ReactNode> = {
    pdf: <FileText className="h-6 w-6 text-red-400" />,
    doc: <FileText className="h-6 w-6 text-blue-400" />,
    docx: <FileText className="h-6 w-6 text-blue-400" />,
    png: <Image className="h-6 w-6 text-green-400" />,
    jpg: <Image className="h-6 w-6 text-green-400" />,
    jpeg: <Image className="h-6 w-6 text-green-400" />,
    zip: <FileArchive className="h-6 w-6 text-amber-400" />,
    rar: <FileArchive className="h-6 w-6 text-amber-400" />,
    mp4: <Film className="h-6 w-6 text-violet-400" />,
}

function getFileIcon(fileType: string | null) {
    if (!fileType) return <FileText className="h-6 w-6 text-gray-400" />
    return fileTypeIcons[fileType.toLowerCase()] || <FileText className="h-6 w-6 text-gray-400" />
}

function formatFileSize(bytes: number | null) {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MateriaisPage() {
    const supabase = createClient()
    const [materials, setMaterials] = useState<Material[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        fetchMaterials()
    }, [])

    async function fetchMaterials() {
        setLoading(true)
        const { data, error } = await supabase
            .from("materials")
            .select("*")
            .eq("is_public", true)
            .order("created_at", { ascending: false })

        if (!error && data) setMaterials(data)
        setLoading(false)
    }

    async function handleDownload(mat: Material) {
        try {
            await supabase.rpc("increment_download_count", { material_id: mat.id })
        } catch {
            // silently ignore if RPC doesn't exist yet
        }
        window.open(mat.file_url, "_blank")
    }

    const categories = [...new Set(materials.map(m => m.category))]

    const filtered = materials.filter(m => {
        const matchSearch =
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            (m.description || "").toLowerCase().includes(search.toLowerCase())
        const matchCategory = !selectedCategory || m.category === selectedCategory
        return matchSearch && matchCategory
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Download className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Materiais de Apoio</h1>
                    <p className="text-sm text-gray-500">Baixe recursos, templates e documentos úteis</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Buscar material..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-[#1e1e1e] border-white/10 text-white placeholder:text-gray-600"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            !selectedCategory
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-[#1e1e1e] text-gray-500 border border-white/5 hover:text-gray-300"
                        }`}
                    >
                        Todos
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                                selectedCategory === cat
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-[#1e1e1e] text-gray-500 border border-white/5 hover:text-gray-300"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-xl bg-[#1e1e1e] border border-white/5 p-12 text-center">
                    <Download className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-gray-300 mb-1">Nenhum material encontrado</h3>
                    <p className="text-xs text-gray-600">
                        {search ? "Tente buscar com outros termos." : "Ainda não há materiais disponíveis."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((mat) => (
                        <div
                            key={mat.id}
                            className="rounded-xl bg-[#1e1e1e] border border-white/5 overflow-hidden hover:border-emerald-500/20 transition-all group"
                        >
                            {/* Thumbnail or Icon */}
                            {mat.thumbnail_url ? (
                                <div className="h-32 bg-[#161616] overflow-hidden">
                                    <img
                                        src={mat.thumbnail_url}
                                        alt={mat.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ) : (
                                <div className="h-24 bg-[#161616] flex items-center justify-center">
                                    {getFileIcon(mat.file_type)}
                                </div>
                            )}

                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-white truncate">{mat.title}</h3>
                                        {mat.description && (
                                            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{mat.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                        <span className="uppercase">{mat.file_type || "arquivo"}</span>
                                        {mat.file_size ? (
                                            <>
                                                <span>·</span>
                                                <span>{formatFileSize(mat.file_size)}</span>
                                            </>
                                        ) : null}
                                        <span>·</span>
                                        <span className="capitalize">{mat.category}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(mat)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition-colors"
                                    >
                                        <Download className="h-3 w-3" />
                                        Baixar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
