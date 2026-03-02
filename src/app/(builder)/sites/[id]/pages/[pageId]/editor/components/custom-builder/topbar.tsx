"use client"

import React, { useState } from "react"
import { ArrowLeft, Clock, Save, Undo, Redo, SlidersHorizontal, Eye, Plus, Layers, FileText, Code, Paintbrush, Type, Circle, Monitor, Smartphone, PanelLeftClose, ChevronDown, Rocket, FileCode, Cookie, LayoutTemplate, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

interface TopbarProps {
    onImportJsonClick?: () => void;
}

export function Topbar({ onImportJsonClick }: TopbarProps = {}) {
    const router = useRouter()
    const [isPagesOpen, setIsPagesOpen] = useState(false)

    return (
        <div className="flex items-center justify-between h-14 border-b bg-white px-2 shadow-sm text-sm">
            {/* Left Section - Tools & Return */}
            <div className="flex items-center space-x-1 h-full">
                <Button variant="ghost" size="sm" className="h-9 px-2 text-muted-foreground mr-2 font-normal" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Voltar
                </Button>

                <Badge variant="secondary" className="bg-gray-100 text-gray-500 font-normal hover:bg-gray-100 hidden md:inline-flex">
                    <Save className="h-3 w-3 mr-1" />
                    Salvar automaticamente desabilitado
                </Badge>

                <div className="w-4"></div>

                {/* Left Action Menu Icons */}
                <div className="flex items-center gap-1 border-l pl-4 border-gray-200">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="Adicionar elementos">
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="Camadas">
                        <Layers className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-md hover:bg-gray-100 ${isPagesOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`}
                            title="Páginas"
                            onClick={() => setIsPagesOpen(!isPagesOpen)}
                        >
                            <FileText className="h-4 w-4" />
                        </Button>

                        {/* Pages Dropdown Modal */}
                        {isPagesOpen && (
                            <div className="absolute top-10 left-0 w-64 bg-white border border-gray-200 shadow-lg rounded-md z-50 overflow-hidden">
                                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                    <span className="font-semibold text-gray-800">Páginas</span>
                                    <button onClick={() => setIsPagesOpen(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="p-2 bg-gray-50/50">
                                    <div className="text-xs text-gray-500 font-medium px-2 py-1">Páginas principais</div>
                                    <div className="mt-1 space-y-0.5">
                                        {['Home', 'About', 'Services', 'Contact', 'Book a free consultant', 'Investment Management'].map((page, idx) => (
                                            <button key={idx} className={`w-full text-left px-3 py-2 text-sm rounded flex flex-row items-center space-x-2 ${idx === 0 ? 'bg-white border text-gray-900 shadow-sm' : 'text-gray-700 hover:bg-gray-100 border border-transparent'}`}>
                                                <FileText className={`h-4 w-4 ${idx === 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span>{page}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="Código de rastreamento (SEO)">
                        <Code className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="Cores e Estilo Global">
                        <Paintbrush className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="Tipografia">
                        <Type className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="Plano de Fundo">
                        <Circle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="Pop-ups">
                        <LayoutTemplate className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="CSS Personalizado">
                        <FileCode className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="Consentimento de Cookies">
                        <Cookie className="h-4 w-4" />
                    </Button>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 rounded-md hover:bg-gray-100" title="Alternar Painel Lateral">
                        <PanelLeftClose className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Center Section - Page Context & Devices */}
            <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="h-8 bg-white border-gray-200 text-gray-700 font-normal hover:bg-gray-50">
                    Home
                    <ChevronDown className="h-3 w-3 ml-2 text-gray-400" />
                </Button>

                <div className="flex items-center bg-gray-100 p-0.5 rounded-md border border-gray-200">
                    <Button variant="ghost" size="icon" className="h-7 w-8 bg-white text-blue-600 shadow-sm rounded">
                        <Monitor className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-8 text-gray-500 rounded hover:text-gray-900">
                        <Smartphone className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200 text-gray-600 hidden md:flex" title="Histórico da versão">
                    <Clock className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200 text-gray-600 hidden md:flex" title="Desfazer">
                    <Undo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200 text-gray-600 hidden md:flex" title="Refazer">
                    <Redo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200 text-gray-600 hidden md:flex" title="Configurações Avançadas">
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="mx-1 h-6 hidden md:block" />

                <div className="flex items-center space-x-2 ml-2">
                    <Button variant="outline" size="sm" className="h-8 border-gray-200 text-gray-600 bg-white" title="Importar JSON" onClick={onImportJsonClick}>
                        <Upload className="h-4 w-4 mr-2" />
                        <span className="text-xs font-medium">Importar (JSON)</span>
                    </Button>

                    <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200 text-gray-600" title="Pré-visualizar">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200 text-gray-600 relative" title="Salvar Site">
                        <Save className="h-4 w-4" />
                        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-yellow-400 border border-white"></span>
                    </Button>
                    <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium">
                        <Rocket className="h-4 w-4 mr-1.5" />
                        Publicar
                    </Button>
                </div>
            </div>
        </div>
    )
}
