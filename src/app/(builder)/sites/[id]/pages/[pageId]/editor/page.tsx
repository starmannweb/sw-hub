"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import GjsEditor, { Canvas, BlocksProvider } from '@grapesjs/react'
// @ts-ignore
import grapesjs from 'grapesjs'
import "grapesjs/dist/css/grapes.min.css"
import {
    Monitor, Tablet, Smartphone, Undo2, Redo2,
    Plus, Type, Image as ImageIcon, LayoutTemplate,
    SquarePlay, Link2, BoxSelect, View, Search,
    Code, ClipboardPaste, HelpCircle, Eye, Settings,
    Trash2, ChevronDown, AlignLeft, GripHorizontal, Target,
    MessageCircle, MousePointer2, Save, Loader2, ArrowLeft
} from "lucide-react"

const gjsOptions = {
    height: '100%',
    storageManager: false, // Save to Supabase manually later
    panels: { defaults: [] }, // We use our custom panels!
    blockManager: {
        blocks: [
            { id: 'section', label: 'Container', category: 'Layout', content: '<section style="padding: 4rem 2rem; background-color: #f1f1f1; min-height: 200px; display: flex; flex-direction: column;"></section>' },
            { id: '2-columns', label: 'Blocos Editáveis', category: 'Layout', content: '<div style="display: flex; gap: 1rem;"><div style="flex:1; min-height:100px; background:#e2e8f0; padding:1rem;"></div><div style="flex:1; min-height:100px; background:#e2e8f0; padding:1rem;"></div></div>' },
            { id: 'text', label: 'Texto', category: 'Basic', content: '<p style="font-family: sans-serif; font-size: 16px; color: #333;">Digite seu texto aqui</p>' },
            { id: 'heading', label: 'Título', category: 'Basic', content: '<h1 style="font-family: sans-serif; font-size: 32px; font-weight: bold; color: #111;">Seu título aqui</h1>' },
            { id: 'image', label: 'Imagem', category: 'Basic', content: { type: 'image' } },
            { id: 'vsl', label: 'VSL', category: 'Basic', content: '<div style="width:100%; aspect-ratio:16/9; background:#000; color:#fff; display:flex; align-items:center; justify-content:center; border-radius:8px;">[ VSL Video Placeholder ]</div>' },
            { id: 'button', label: 'Botão', category: 'Basic', content: '<button style="padding: 12px 24px; background-color: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: sans-serif; font-weight: bold;">Clique aqui</button>' },
            { id: 'link', label: 'Link', category: 'Basic', content: '<a href="#" style="color: #8b5cf6; text-decoration: underline; font-family: sans-serif;">Saiba mais</a>' },
            { id: 'custom', label: 'Custom', category: 'Basic', content: '<div>Custom HTML</div>' },
        ]
    }
}

export default function SiteEditorPage() {
    const params = useParams()
    const router = useRouter()
    const siteId = params.id as string
    const pageId = params.pageId as string
    const editorRef = useRef<any>(null)

    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [leftPanelMode, setLeftPanelMode] = useState<'elements' | 'layers'>('layers')
    const [selectedElement, setSelectedElement] = useState<'section' | 'headline' | 'vsl'>('section')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [pageData, setPageData] = useState<any>(null)
    const [error, setError] = useState("")

    // Load page data from Supabase
    useEffect(() => {
        const fetchPage = async () => {
            try {
                const supabase = createClient()
                const { data, error: fetchError } = await supabase
                    .from("site_pages")
                    .select("*")
                    .eq("id", pageId)
                    .single()

                if (fetchError || !data) throw new Error("Página não encontrada")
                setPageData(data)
            } catch (err) {
                console.error("Erro ao carregar página:", err)
                setError("Não foi possível carregar a página.")
            } finally {
                setLoading(false)
            }
        }
        if (pageId) fetchPage()
    }, [pageId])

    // Save to Supabase
    const handleSave = async () => {
        if (!editorRef.current) return
        setSaving(true)
        try {
            const editor = editorRef.current
            const projectData = editor.getProjectData()
            const html = editor.getHtml()
            const css = editor.getCss()

            const supabase = createClient()
            const { error: saveError } = await supabase
                .from("site_pages")
                .update({
                    content: projectData,
                    published_html: html,
                    published_css: css,
                })
                .eq("id", pageId)

            if (saveError) throw saveError
            alert("Salvo com sucesso! ✅")
        } catch (err) {
            console.error("Erro ao salvar:", err)
            alert("Erro ao salvar. Tente novamente.")
        } finally {
            setSaving(false)
        }
    }

    const handleEditorReady = (editor: any) => {
        editorRef.current = editor

        // Load clone data from localStorage (from Replicator)
        const cloneData = localStorage.getItem('site_clone_data')
        if (cloneData) {
            try {
                const parsed = JSON.parse(cloneData)
                if (parsed.html) editor.setComponents(parsed.html)
                if (parsed.css) editor.setStyle(parsed.css)
                localStorage.removeItem('site_clone_data')
                return // Prioriza clone data sobre dados do banco
            } catch (e) {
                console.error("Error loading clone data", e)
            }
        }

        // Load existing content from database
        if (pageData?.content) {
            try {
                if (pageData.content.pages || pageData.content.styles) {
                    editor.loadProjectData(pageData.content)
                } else if (pageData.content.html) {
                    editor.setComponents(pageData.content.html)
                    if (pageData.content.css) editor.setStyle(pageData.content.css)
                }
            } catch (e) {
                console.error("Error loading saved content", e)
            }
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0b0b10]">
                <Loader2 className="h-8 w-8 animate-spin text-[#8b5cf6] mr-3" />
                <span className="text-[#a1a1aa]">Preparando editor...</span>
            </div>
        )
    }

    // Error state
    if (error || !pageData) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-[#0b0b10] text-white p-4">
                <h2 className="text-2xl font-bold mb-2">Ops!</h2>
                <p className="text-[#a1a1aa] mb-6">{error}</p>
                <button onClick={() => router.push(`/sites/${siteId}`)} className="bg-[#8b5cf6] text-white px-6 py-2 rounded-xl">
                    Voltar para o Funil
                </button>
            </div>
        )
    }

    return (
        <GjsEditor grapesjs={grapesjs} options={gjsOptions} onEditor={handleEditorReady}>
            <div className="flex flex-col h-screen w-full overflow-hidden bg-[#16161a] text-[#b4b4c0] font-sans selection:bg-[#8b5cf6]/30">

                {/* TOP BAR */}
                <div className="h-14 shrink-0 bg-[#16161a] border-b border-[#232329] flex items-center justify-between px-3 z-30">
                    {/* Left Controls */}
                    <div className="flex items-center gap-1 w-1/3">
                        <button onClick={() => router.push(`/sites/${siteId}`)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#232329] text-[#71717a] hover:text-white transition-colors mr-1" title="Voltar">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center justify-center w-10 h-10 mr-2 text-[#8b5cf6] font-extrabold text-lg">
                            SW
                        </div>

                        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#232329] text-[#71717a] hover:text-white transition-colors" title="Desfazer">
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#232329] text-[#71717a] hover:text-white transition-colors mr-2" title="Refazer">
                            <Redo2 className="w-4 h-4" />
                        </button>

                        <button
                            className="w-10 h-10 ml-2 rounded-[10px] flex items-center justify-center transition-colors shadow-sm bg-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                            title="Ativar/Desativar seleção de elementos"
                        >
                            <MousePointer2 className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setLeftPanelMode('elements')}
                            className={`w-10 h-10 ml-1.5 rounded-[10px] flex items-center justify-center transition-colors ${leftPanelMode === 'elements' ? 'bg-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-[#8b5cf6] text-white'}`}
                            title="Adicionar Elementos"
                        >
                            <Plus className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setLeftPanelMode('layers')}
                            className={`w-10 h-10 ml-1.5 rounded-[10px] flex items-center justify-center transition-colors ${leftPanelMode === 'layers' ? 'bg-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-[#8b5cf6] text-white'}`}
                            title="Camadas / Elements Tree"
                        >
                            <LayoutTemplate className="w-5 h-5" />
                        </button>

                        <button className="w-9 h-9 ml-1 flex items-center justify-center rounded-lg hover:bg-[#232329] text-[#71717a] hover:text-white transition-colors" title="Ajuda">
                            <HelpCircle className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Center - Viewport & Page Controls */}
                    <div className="flex flex-1 items-center justify-center gap-4">
                        {/* Page Selector */}
                        <button className="flex items-center gap-2 bg-[#232329] hover:bg-[#2e2e36] px-4 py-1.5 rounded-lg border border-[#31313a] text-[13px] font-medium transition-colors text-[#e4e4e7]">
                            <LayoutTemplate className="w-3.5 h-3.5 text-[#a1a1aa]" />
                            principal
                            <ChevronDown className="w-3.5 h-3.5 text-[#71717a] ml-1" />
                        </button>

                        {/* Viewport Toggles */}
                        <div className="flex items-center gap-0.5 bg-[#232329] p-1 rounded-xl border border-[#31313a]">
                            <button
                                onClick={() => setViewport('desktop')}
                                className={`p-1.5 px-3 rounded-lg flex items-center justify-center transition-all ${viewport === 'desktop' ? 'bg-[#8b5cf6] text-white' : 'text-[#71717a] hover:text-white'}`}
                            >
                                <Monitor className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewport('tablet')}
                                className={`p-1.5 px-3 rounded-lg flex items-center justify-center transition-all ${viewport === 'tablet' ? 'bg-[#8b5cf6] text-white' : 'text-[#71717a] hover:text-white'}`}
                            >
                                <Tablet className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewport('mobile')}
                                className={`p-1.5 px-3 rounded-lg flex items-center justify-center transition-all ${viewport === 'mobile' ? 'bg-[#8b5cf6] text-white' : 'text-[#71717a] hover:text-white'}`}
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center justify-end gap-2 w-1/3">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white transition-colors shadow-sm">
                            <Eye className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#232329] text-[#b4b4c0] transition-colors">
                            <Code className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 ml-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 text-white text-[13px] font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>

                {/* MAIN WORKSPACE */}
                <div className="flex-1 flex overflow-hidden relative">

                    {/* ---------- LEFT SIDEBAR (Dynamic based on selected mode) ---------- */}
                    <div className="w-[310px] h-full shrink-0 bg-[#1c1c22] border-r border-[#232329] flex flex-col z-20 shadow-xl overflow-y-auto custom-scrollbar relative">

                        {leftPanelMode === 'elements' ? (
                            <div className="p-4 space-y-6">
                                <BlocksProvider>
                                    {({ blocks, dragStart, dragStop }: any) => {
                                        const getBlockProps = (id: string) => {
                                            const block = blocks.find((b: any) => b.getId() === id)
                                            if (!block) return {}
                                            return {
                                                draggable: true,
                                                onDragStart: (ev: any) => dragStart(block, ev.nativeEvent),
                                                onDragEnd: () => dragStop(false)
                                            }
                                        }

                                        return (
                                            <>
                                                {/* Category: LAYOUT */}
                                                <div>
                                                    <div className="flex items-center justify-between cursor-pointer mb-3">
                                                        <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#71717a] uppercase">Layout</h4>
                                                        <ChevronDown className="w-3.5 h-3.5 text-[#52525b]" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div {...getBlockProps('section')} className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing hover:border-[#8b5cf6] hover:bg-[#1a1a24] transition-all group aspect-[4/3] shadow-sm hover:-translate-y-0.5">
                                                            <BoxSelect className="w-6 h-6 text-[#71717a] group-hover:text-[#8b5cf6]" strokeWidth={1.5} />
                                                            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white">Container</span>
                                                        </div>
                                                        <div {...getBlockProps('2-columns')} className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing hover:border-[#8b5cf6] hover:bg-[#1a1a24] transition-all group aspect-[4/3] shadow-sm hover:-translate-y-0.5">
                                                            <div className="grid grid-cols-2 gap-1 w-6 h-6">
                                                                <div className="bg-[#71717a] group-hover:bg-[#8b5cf6] rounded-sm"></div>
                                                                <div className="bg-[#71717a] group-hover:bg-[#8b5cf6] rounded-sm"></div>
                                                                <div className="bg-[#71717a] group-hover:bg-[#8b5cf6] rounded-sm"></div>
                                                                <div className="bg-[#71717a] group-hover:bg-[#8b5cf6] rounded-sm"></div>
                                                            </div>
                                                            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white relative left-4">Colunas</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Category: BÁSICOS */}
                                                <div className="pt-2">
                                                    <div className="flex items-center justify-between cursor-pointer mb-3">
                                                        <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#71717a] uppercase">Básicos</h4>
                                                        <ChevronDown className="w-3.5 h-3.5 text-[#52525b]" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div {...getBlockProps('text')} className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing hover:border-[#8b5cf6] transition-all group aspect-[4/3]">
                                                            <AlignLeft className="w-6 h-6 text-[#71717a] group-hover:text-[#8b5cf6]" strokeWidth={1.5} />
                                                            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white">Texto</span>
                                                        </div>
                                                        <div {...getBlockProps('heading')} className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing hover:border-[#8b5cf6] transition-all group aspect-[4/3]">
                                                            <span className="text-[28px] font-serif text-[#71717a] group-hover:text-[#8b5cf6] leading-none mb-0.5">H</span>
                                                            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white">Título</span>
                                                        </div>
                                                        <div {...getBlockProps('image')} className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing hover:border-[#8b5cf6] transition-all group aspect-[4/3]">
                                                            <ImageIcon className="w-6 h-6 text-[#71717a] group-hover:text-[#8b5cf6]" strokeWidth={1.5} />
                                                            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white">Imagem</span>
                                                        </div>
                                                        <div {...getBlockProps('vsl')} className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing hover:border-[#8b5cf6] transition-all group aspect-[4/3]">
                                                            <SquarePlay className="w-6 h-6 text-[#71717a] group-hover:text-[#8b5cf6]" strokeWidth={1.5} />
                                                            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white">VSL</span>
                                                        </div>
                                                        <div {...getBlockProps('button')} className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing hover:border-[#8b5cf6] transition-all group aspect-[4/3]">
                                                            <div className="w-6 h-4 bg-[#71717a] group-hover:bg-[#8b5cf6] flex items-center justify-center rounded-sm">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#16161a] animate-pulse"></div>
                                                            </div>
                                                            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white">Botão</span>
                                                        </div>
                                                        <div {...getBlockProps('link')} className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing hover:border-[#8b5cf6] transition-all group aspect-[4/3]">
                                                            <Link2 className="w-6 h-6 text-[#71717a] group-hover:text-[#8b5cf6]" strokeWidth={1.5} />
                                                            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white">Link</span>
                                                        </div>
                                                        <div {...getBlockProps('custom')} className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-grab active:cursor-grabbing hover:border-[#8b5cf6] transition-all group aspect-[4/3]">
                                                            <Code className="w-6 h-6 text-[#71717a] group-hover:text-[#8b5cf6]" strokeWidth={1.5} />
                                                            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white">Custom</span>
                                                        </div>
                                                        <div className="bg-[#13231a] border border-[#1b3b28] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#22c55e] transition-all group aspect-[4/3]">
                                                            <ClipboardPaste className="w-6 h-6 text-emerald-500 group-hover:text-emerald-400" strokeWidth={1.5} />
                                                            <span className="text-[11px] font-medium text-emerald-500 group-hover:text-emerald-400">Colar bloco</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }}
                                </BlocksProvider>

                                {/* CONFIGURAÇÕES DO PROJETO */}
                                <div className="pt-2">
                                    <div className="flex items-center justify-between cursor-pointer mb-3">
                                        <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#71717a] uppercase">Configurações do Projeto</h4>
                                        <ChevronDown className="w-3.5 h-3.5 text-[#52525b]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#8b5cf6] group">
                                            <Code className="w-5 h-5 text-[#8b5cf6]" strokeWidth={1.5} />
                                            <span className="text-[10px] font-medium text-[#a1a1aa]">Scripts</span>
                                        </div>
                                        <div className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#8b5cf6] group">
                                            <Target className="w-5 h-5 text-[#8b5cf6]" strokeWidth={1.5} />
                                            <span className="text-[10px] font-medium text-[#a1a1aa]">Rastreamento</span>
                                        </div>
                                        <div className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#8b5cf6] group">
                                            <Link2 className="w-5 h-5 text-[#8b5cf6]" strokeWidth={1.5} />
                                            <span className="text-[10px] font-medium text-[#a1a1aa]">UTM</span>
                                        </div>
                                        <div className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#8b5cf6] group">
                                            <Search className="w-5 h-5 text-[#8b5cf6]" strokeWidth={1.5} />
                                            <span className="text-[10px] font-medium text-[#a1a1aa]">SEO</span>
                                        </div>
                                        <div className="bg-[#16161a] border border-[#232329] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#8b5cf6] group col-span-1">
                                            <MessageCircle className="w-5 h-5 text-[#8b5cf6]" strokeWidth={1.5} />
                                            <span className="text-[10px] font-medium text-[#a1a1aa]">WhatsApp</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // ELEMENTS TREE & STYLER MODE (2nd Screenshot)
                            <div className="flex flex-col h-full w-full">
                                {/* Elements List */}
                                <div className="p-4 border-b border-[#232329]">
                                    <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#71717a] uppercase mb-4">Elements</h4>

                                    <div className="relative mb-4">
                                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#71717a]" />
                                        <input
                                            type="text"
                                            placeholder="Filtrar por tag, id ou classe..."
                                            className="w-full bg-[#16161a] border border-[#31313a] rounded-lg pl-9 pr-3 py-2 text-xs text-[#e4e4e7] placeholder:text-[#52525b] outline-none focus:border-[#8b5cf6]"
                                        />
                                        <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-[#52525b]" />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 cursor-pointer hover:bg-[#232329] p-1.5 rounded-md text-xs text-[#a1a1aa]">
                                            <ChevronDown className="w-3.5 h-3.5 shrink-0 invisible" />
                                            <span className="font-mono text-[10px] opacity-60 ml-0.5">&lt;div&gt;</span>
                                            <span className="font-medium text-[#e4e4e7]">div.sub...</span>
                                            <Trash2 className="w-3.5 h-3.5 ml-auto opacity-0 hover:opacity-100 transition-opacity text-[#ef4444]" />
                                        </div>
                                        <div className="flex items-center gap-1 bg-[#8b5cf6]/10 p-1.5 rounded-md text-xs text-white cursor-pointer relative -ml-2">
                                            <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#8b5cf6] rounded-r"></div>
                                            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-[#8b5cf6]" />
                                            <span className="font-mono text-[10px] text-[#8b5cf6] ml-0.5">&lt;section&gt;</span>
                                            <span className="font-medium">sec...</span>
                                            <Trash2 className="w-3.5 h-3.5 ml-auto text-[#ef4444]" />
                                        </div>
                                        <div className="flex items-center gap-1 cursor-pointer hover:bg-[#232329] p-1.5 rounded-md text-xs text-[#a1a1aa] ml-5">
                                            <ChevronDown className="w-3.5 h-3.5 shrink-0 invisible" />
                                            <span className="font-mono text-[10px] opacity-60 ml-0.5">&lt;div&gt;</span>
                                            <span className="font-medium text-[#e4e4e7]">div.c...</span>
                                            <Trash2 className="w-3.5 h-3.5 ml-auto opacity-0 hover:opacity-100 transition-opacity text-[#ef4444]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Layout/Estilo Tabs */}
                                <div className="flex px-4 py-3 gap-1">
                                    <button className="flex-1 py-1.5 bg-[#8b5cf6] text-white text-[11px] font-bold rounded-lg px-2">Layout</button>
                                    <button className="flex-1 py-1.5 bg-transparent hover:bg-[#232329] text-[#a1a1aa] text-[11px] font-medium rounded-lg">Estilo</button>
                                    <button className="flex-1 py-1.5 bg-transparent hover:bg-[#232329] text-[#a1a1aa] text-[11px] font-medium rounded-lg">Avançado</button>
                                </div>

                                {/* Property Editor Mock */}
                                <div className="p-4 space-y-6 flex-1">
                                    <div>
                                        <p className="text-[11px] text-[#71717a] mb-2 font-medium">Selecionado:</p>
                                        <div className="inline-block bg-[#2e1065] text-[#d8b4fe] text-[10px] font-mono px-2 py-0.5 rounded">
                                            {selectedElement === 'section' ? 'section' : selectedElement === 'headline' ? 'h1' : 'div'}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between cursor-pointer mb-3">
                                            <h4 className="text-[11px] font-bold text-[#e4e4e7]">Layout</h4>
                                            <ChevronDown className="w-4 h-4 text-[#71717a]" />
                                        </div>
                                        <p className="text-[10px] text-[#71717a] mb-2 font-medium">Tipo de exibição</p>
                                        <div className="flex gap-1 bg-[#16161a] p-1 rounded-lg border border-[#232329]">
                                            <button className="flex-1 py-1.5 bg-[#8b5cf6] text-white rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5">
                                                <div className="w-3 h-3 border-2 border-current rounded-sm"></div>
                                                Bloco
                                            </button>
                                            <button className="flex-1 py-1.5 hover:bg-[#232329] text-[#a1a1aa] rounded-[6px] text-xs font-medium flex items-center justify-center gap-1.5">
                                                <AlignLeft className="w-3.5 h-3.5" />
                                                Flex
                                            </button>
                                            <button className="flex-1 py-1.5 hover:bg-[#232329] text-[#a1a1aa] rounded-[6px] text-xs font-medium flex items-center justify-center gap-1.5">
                                                <LayoutTemplate className="w-3.5 h-3.5" />
                                                Grid
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[11px] font-bold tracking-[0.1em] text-[#71717a] uppercase mb-4">Posicionamento</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-[#71717a] mb-1 font-medium">Position</p>
                                                <div className="bg-[#16161a] border border-[#31313a] rounded-lg px-3 py-1.5 flex justify-between items-center cursor-pointer">
                                                    <span className="text-xs text-white">Static</span>
                                                    <ChevronDown className="w-3 h-3 text-[#71717a]" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#71717a] mb-1 font-medium">Overflow</p>
                                                <div className="bg-[#16161a] border border-[#31313a] rounded-lg px-3 py-1.5 flex justify-between items-center cursor-pointer">
                                                    <span className="text-xs text-white">Visible</span>
                                                    <ChevronDown className="w-3 h-3 text-[#71717a]" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[10px] text-[#71717a] font-medium">Z-Index</p>
                                                <div className="flex gap-2">
                                                    <button className="text-[9px] bg-[#2e1065] text-[#d8b4fe] px-1.5 py-0.5 rounded font-bold">auto</button>
                                                    <button className="text-[9px] text-[#71717a]">0</button>
                                                    <button className="text-[9px] text-[#71717a]">10</button>
                                                    <button className="text-[9px] text-[#71717a]">100</button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input type="range" className="flex-1 accent-[#8b5cf6]" min="0" max="100" defaultValue="0" />
                                            </div>
                                            <p className="text-xs text-white mt-2">0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ---------- CENTER CANVAS AREA ---------- */}
                    {/* The deep dark root space */}
                    <div className="flex-1 bg-[#0b0b10] overflow-hidden relative flex flex-col pt-6">
                        {/* The "Paper" representing the website viewport */}
                        <div className={`mx-auto origin-top relative border border-[#232329] rounded-t-lg overflow-hidden bg-white shadow-2xl transition-all duration-300 ${viewport === 'desktop' ? 'w-full max-w-[1280px] h-[calc(100%-1.5rem)]' :
                            viewport === 'tablet' ? 'w-[768px] h-[calc(100%-1.5rem)]' :
                                'w-[375px] h-[calc(100%-1.5rem)]'
                            }`}>
                            <Canvas className="w-full h-full [&>.gjs-cv-canvas]:!top-0 [&>.gjs-cv-canvas]:!left-0 [&>.gjs-cv-canvas]:!w-full [&>.gjs-cv-canvas]:!h-full" />
                        </div>
                    </div>

                </div>
            </div>
        </GjsEditor>
    )
}

function CopyIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    )
}
