"use client"

import React, { useState } from "react"
import { Search, X, Type, LayoutGrid, Image as ImageIcon, FormInput, List as ListIcon, Columns2, Columns3, Columns4, PanelTop, Pilcrow, AlignJustify, AlignCenter, AlignLeft, Square, MousePointerClick, MessageSquareText, SearchCode, Share2, Mail, Newspaper, MonitorPlay, Images, GalleryHorizontalEnd, CodeXml, FileText, CalendarDays, Map, MountainSnow, Star, Parentheses, QrCode, Coins, Hourglass, Timer, Clock, Menu, SeparatorHorizontal, Loader, ShoppingCart, BadgeCheck, Network, Sun, BarChart, Package, Minus, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const categories = [
    { id: "quick", label: "Adição Rápida" },
    { id: "segments", label: "Segmentos" },
    { id: "rows", label: "Linhas", active: true },
    { id: "components", label: "Componentes" },
    { id: "templates", label: "Modelos De Seção" },
    { id: "saved", label: "Ativos Salvos", isNew: true },
    { id: "marketplace", label: "Marketplace De Widgets" },
    { id: "store", label: "Armazenar" },
]

// Organizing our content blocks per their respective category
const contentMap: Record<string, { title: string, groups: { category?: string, items: any[] }[] }> = {
    "segments": {
        title: "Adicione uma seção",
        groups: [
            {
                items: [
                    { id: "seg-full", label: "Largura total", icon: <AlignJustify className="h-6 w-6 text-gray-400 mb-2 transform rotate-90" /> },
                    { id: "seg-wide", label: "Largo", icon: <AlignCenter className="h-6 w-6 text-gray-400 mb-2 transform rotate-90" /> },
                    { id: "seg-med", label: "Médio", icon: <AlignLeft className="h-6 w-6 text-gray-400 mb-2 transform rotate-90" /> },
                    { id: "seg-small", label: "Pequeno", icon: <Square className="h-6 w-6 text-gray-400 mb-2" /> },
                ]
            }
        ]
    },
    "rows": {
        title: "Adicionar uma linha",
        groups: [
            {
                items: [
                    { id: "r-1col", label: "1 Coluna", icon: <PanelTop className="h-6 w-6 text-gray-400 mb-2" /> },
                    { id: "r-2col", label: "2 Colunas", icon: <Columns2 className="h-6 w-6 text-gray-400 mb-2" /> },
                    { id: "r-3col", label: "3 colunas", icon: <Columns3 className="h-6 w-6 text-gray-400 mb-2" /> },
                    { id: "r-4col", label: "4 Colunas", icon: <Columns4 className="h-6 w-6 text-gray-400 mb-2" /> },
                    { id: "r-5col", label: "5 Colunas", icon: <LayoutGrid className="h-6 w-6 text-gray-400 mb-2" /> },
                    { id: "r-6col", label: "6 colunas", icon: <LayoutGrid className="h-6 w-6 text-gray-400 mb-2" /> },
                ]
            }
        ]
    },
    "components": {
        title: "Adicionar um elemento",
        groups: [
            {
                category: "Texto",
                items: [
                    { id: "c-heading", label: "Título", icon: <Type className="h-6 w-6 text-gray-600 mb-2 font-serif" /> },
                    { id: "c-sub", label: "Subtítulo", icon: <Type className="h-5 w-5 text-gray-500 mb-2 font-sans" /> },
                    { id: "c-para", label: "Parágrafo", icon: <Pilcrow className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-list", label: "Lista em tópicos", icon: <ListIcon className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-body", label: "Corpo saturado", icon: <Type className="h-6 w-6 text-gray-600 mb-2 underline" />, isNew: true },
                ]
            },
            {
                category: "Formulário",
                items: [
                    { id: "c-btn", label: "Botão", icon: <MousePointerClick className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-form", label: "Formulário", icon: <FormInput className="h-6 w-6 text-gray-500 mb-2" /> },
                ]
            },
            {
                category: "Blog",
                items: [
                    { id: "c-blog", label: "Publicações de blog", icon: <Newspaper className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-nav", label: "Navegação por categoria", icon: <SearchCode className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-share", label: "Compartilhamento social", icon: <Share2 className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-email", label: "Assinar a lista de e-mails", icon: <Mail className="h-6 w-6 text-gray-500 mb-2" /> },
                ]
            },
            {
                category: "Mídia",
                items: [
                    { id: "c-carousel", label: "Carrossel de imagens", icon: <ImageIcon className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-video", label: "Vídeo", icon: <MonitorPlay className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-image", label: "Imagem", icon: <ImageIcon className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-faq", label: "FAQ", icon: <Minus className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-gallery", label: "Galeria de fotos", icon: <Images className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-logo", label: "Exibição do Logotipo", icon: <GalleryHorizontalEnd className="h-6 w-6 text-gray-500 mb-2" />, isNew: true },
                    { id: "c-testimonial", label: "Depoimentos", icon: <MessageSquareText className="h-6 w-6 text-gray-500 mb-2" />, isNew: true },
                ]
            },
            {
                category: "Personalizado",
                items: [
                    { id: "c-code", label: "Código", icon: <CodeXml className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-survey", label: "Pesquisa", icon: <FileText className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-calendar", label: "Calendário", icon: <CalendarDays className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-map", label: "Mapear", icon: <Map className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-svg", label: "SVG", icon: <MountainSnow className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-reviews", label: "Avaliações", icon: <Star className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-count", label: "Contagem de números", icon: <Parentheses className="h-6 w-6 text-gray-500 mb-2" />, isNew: true },
                    { id: "c-qr", label: "Código QR", icon: <QrCode className="h-6 w-6 text-gray-500 mb-2" />, isNew: true },
                    { id: "c-pricing", label: "Tabela de precificação", icon: <Coins className="h-6 w-6 text-gray-500 mb-2" />, isNew: true },
                ]
            },
            {
                category: "Contagem regressiva",
                items: [
                    { id: "c-timer-reg", label: "Contagem regressiva", icon: <Hourglass className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-timer-min", label: "Temporizador de minutos", icon: <Timer className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-timer-day", label: "Temporizador diário", icon: <Clock className="h-6 w-6 text-gray-500 mb-2" /> },
                ]
            },
            {
                category: "Blocos",
                items: [
                    { id: "c-menu", label: "Menu de Navegação", icon: <Menu className="h-6 w-6 text-gray-500 mb-2" />, isNew: true },
                    { id: "c-divider", label: "Divisória", icon: <SeparatorHorizontal className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-progbar", label: "Barra de progresso", icon: <Loader className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-imgfeat", label: "Recurso de imagem", icon: <ImageIcon className="h-6 w-6 text-gray-500 mb-2" /> },
                ]
            },
            {
                category: "Rede social",
                items: [
                    { id: "c-socialicon", label: "Ícones de redes sociais", icon: <Share2 className="h-6 w-6 text-gray-500 mb-2" /> },
                ]
            },
            {
                category: "Elementos do pedido",
                items: [
                    { id: "c-order2", label: "Pedido em 2 etapas", icon: <ShoppingCart className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-order1", label: "Pedido em 1 etapa", icon: <ShoppingCart className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-orderchk", label: "Confirmação do pedido", icon: <BadgeCheck className="h-6 w-6 text-gray-500 mb-2" /> },
                ]
            },
            {
                category: "Armazenar",
                items: [
                    { id: "c-cart", label: "Carrinho", icon: <ShoppingCart className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-search", label: "Barra de pesquisa", icon: <Search className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-colllist", label: "Lista de coleções", icon: <Network className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-featprod", label: "Produtos em destaque", icon: <Sun className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-upsell", label: "Venda adicional", icon: <BarChart className="h-6 w-6 text-gray-500 mb-2" /> },
                    { id: "c-prodfeat", label: "Produto em destaque", icon: <Package className="h-6 w-6 text-gray-500 mb-2" /> },
                ]
            }
        ]
    },
    // Fallback exactly like Adição Rápida
    "quick": {
        title: "Adição rápida",
        groups: [
            {
                category: "Linhas",
                items: [
                    { id: "q-1col", label: "1 Coluna", icon: <PanelTop className="h-6 w-6 text-gray-400 mb-2" /> },
                    { id: "q-2col", label: "2 Colunas", icon: <Columns2 className="h-6 w-6 text-gray-400 mb-2" /> },
                    { id: "q-3col", label: "3 colunas", icon: <Columns3 className="h-6 w-6 text-gray-400 mb-2" /> },
                    { id: "q-4col", label: "4 Colunas", icon: <Columns4 className="h-6 w-6 text-gray-400 mb-2" /> },
                ]
            },
            {
                category: "Texto",
                items: [
                    { id: "q-heading", label: "Título", icon: <Type className="h-6 w-6 text-gray-600 mb-2" /> },
                    { id: "q-sub", label: "Subtítulo", icon: <Type className="h-5 w-5 text-gray-500 mb-2" /> },
                    { id: "q-para", label: "Parágrafo", icon: <Pilcrow className="h-6 w-6 text-gray-400 mb-2" /> },
                ]
            }
        ]
    }
}

interface LeftSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    editor?: any;
}

export function LeftSidebar({ isOpen, onClose, editor }: LeftSidebarProps) {
    const [activeTab, setActiveTab] = useState<string>("elements")
    const [panelOpen, setPanelOpen] = useState(true)
    const [activeCategory, setActiveCategory] = useState("components")

    const handleTabClick = (tabId: string) => {
        if (activeTab === tabId) {
            setPanelOpen(!panelOpen)
        } else {
            setActiveTab(tabId)
            setPanelOpen(true)
        }
    }

    // Get active content mapped to current category
    const currentView = contentMap[activeCategory] || contentMap["quick"]

    return (
        <div className="z-10 flex h-full shadow-xl shrink-0 bg-white">
            {/* Narrow Icon Bar */}
            <div className="w-[50px] shrink-0 border-r bg-white h-full flex flex-col items-center py-4">
                <button
                    onClick={() => handleTabClick('elements')}
                    className={`w-10 h-10 rounded-md flex items-center justify-center mb-2 transition-colors ${activeTab === 'elements' && panelOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Adicionar elementos"
                >
                    <Plus className="h-5 w-5" />
                </button>
                <button
                    onClick={() => handleTabClick('layers')}
                    className={`w-10 h-10 rounded-md flex items-center justify-center mb-2 transition-colors ${activeTab === 'layers' && panelOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Camadas"
                >
                    <Network className="h-5 w-5" />
                </button>
                <button
                    onClick={() => handleTabClick('pages')}
                    className={`w-10 h-10 rounded-md flex items-center justify-center mb-2 transition-colors ${activeTab === 'pages' && panelOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Páginas"
                >
                    <FileText className="h-5 w-5" />
                </button>
                <button
                    onClick={() => handleTabClick('styles')}
                    className={`w-10 h-10 rounded-md flex items-center justify-center mb-2 transition-colors ${activeTab === 'styles' && panelOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Estilo Global"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" /><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" /></svg>
                </button>
                <button
                    onClick={() => handleTabClick('media')}
                    className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${activeTab === 'media' && panelOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Mídia"
                >
                    <Images className="h-5 w-5" />
                </button>
            </div>

            {/* Expandable Panel */}
            {panelOpen && (
                <div className="flex border-r bg-white h-full overflow-hidden w-[600px] max-w-[calc(100vw-50px)]">
                    {activeTab === 'elements' && (
                        <>
                            {/* Categories Menu */}
                            <div className="w-1/3 border-r bg-gray-50/50 flex flex-col shrink-0">
                                <div className="p-4 py-3 font-medium text-sm text-gray-700 bg-gray-50">
                                    Menu
                                </div>
                                <ScrollArea className="flex-1">
                                    <div className="py-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setActiveCategory(cat.id)}
                                                className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center transition-colors ${activeCategory === cat.id
                                                    ? 'bg-blue-50/50 text-blue-700 font-medium border-l-2 border-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-2 border-transparent'
                                                    }`}
                                            >
                                                {cat.label}
                                                {cat.isNew && (
                                                    <Badge className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-none px-1.5 py-0 text-[10px] font-bold">
                                                        Novo
                                                    </Badge>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Content Panel */}
                            <div className="w-2/3 bg-white flex flex-col">
                                <div className="p-4 py-3 flex items-center justify-between border-b">
                                    <h3 className="font-semibold text-gray-800">{currentView.title}</h3>
                                    <button onClick={() => setPanelOpen(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="p-4 border-b">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder={currentView.title.includes("elemento") ? "Pesquisar elemento" : "Pesquisar"}
                                            className="pl-9 bg-white border-gray-200"
                                        />
                                    </div>
                                </div>

                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-6">
                                        {currentView.groups.map((group, idx) => (
                                            <div key={idx}>
                                                {group.category && (
                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">{group.category}</h4>
                                                )}
                                                <div className={`grid gap-3 ${group.category ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                                    {group.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            onClick={async () => {
                                                                if (!editor) return;

                                                                let content = '';
                                                                if (item.id === 'c-heading') content = '<h2 style="padding:10px;">Seu Título Aqui</h2>';
                                                                else if (item.id === 'c-para') content = '<p style="padding:10px;">Um parágrafo de texto incrível para o site.</p>';
                                                                else if (item.id === 'c-btn') content = '<a href="#" class="button" style="padding:10px 20px; background:#007bff; color:#fff; border-radius:5px; text-decoration:none; display:inline-block; margin: 10px;">Clique Aqui</a>';
                                                                else if (item.id === 'c-form') {
                                                                    // Capturamos a URL para tirar o PageId se conseguirmos ou deixamos para um replace
                                                                    const pathSegments = window.location.pathname.split('/');
                                                                    const pageIdIndex = pathSegments.indexOf('pages') + 1;
                                                                    const parsedPageId = pathSegments[pageIdIndex] || "ID_DA_PAGINA";

                                                                    content = `
                                                                        <form action="/api/webhooks/forms" method="POST" class="hub-smart-form" style="padding: 24px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 400px; margin: 20px auto; display: flex; flex-direction: column; gap: 16px; font-family: sans-serif;">
                                                                            <h3 style="margin: 0; padding-bottom: 12px; border-bottom: 1px solid #eee; color:#1f2937; font-size: 1.25rem; text-align:center;">Preencha seus dados</h3>
                                                                            
                                                                            <input type="hidden" name="page_id" value="${parsedPageId}" />
                                                                            <input type="hidden" name="ref" class="hub-promoter-id" value="" />
                                                                            <input type="hidden" name="redirect_url" class="hub-redirect-url" value="" />
                                                                            
                                                                            <div style="display:flex; flex-direction:column; gap:6px;">
                                                                                <label style="font-size:0.875rem; color:#4b5563; font-weight:600;">Nome Completo</label>
                                                                                <input type="text" name="name" required style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;" />
                                                                            </div>
                                                                            
                                                                            <div style="display:flex; flex-direction:column; gap:6px;">
                                                                                <label style="font-size:0.875rem; color:#4b5563; font-weight:600;">E-mail principal</label>
                                                                                <input type="email" name="email" required style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;" />
                                                                            </div>
                                                                            
                                                                            <div style="display:flex; flex-direction:column; gap:6px;">
                                                                                <label style="font-size:0.875rem; color:#4b5563; font-weight:600;">WhatsApp</label>
                                                                                <input type="tel" name="phone" style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;" />
                                                                            </div>
                                                                            
                                                                            <button type="submit" style="padding: 14px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1rem; margin-top:8px;">Enviar Contato</button>
                                                                            <div class="success-msg" style="display:none; color: green; text-align:center; font-size:0.875rem;">Obrigado! Recebemos seu contato.</div>
                                                                            
                                                                            <script>
                                                                                document.addEventListener("DOMContentLoaded", () => {
                                                                                    const ref = new URLSearchParams(window.location.search).get('ref');
                                                                                    if (ref) document.querySelectorAll('.hub-promoter-id').forEach(el => el.value = ref);
                                                                                    document.querySelectorAll('.hub-redirect-url').forEach(el => el.value = window.location.href);
                                                                                });
                                                                            </script>
                                                                        </form>
                                                                    `;
                                                                } else {
                                                                    // Genérico para visualizar
                                                                    content = `
                                                                        <div style="padding: 20px; background: #f8f9fa; border: 1px dashed #ccc; text-align: center; border-radius: 5px; margin: 10px;">
                                                                            <p style="color: #666; font-size: 14px; margin:0;">🚀 Bloco Reservado: ${item.label}</p>
                                                                        </div>
                                                                    `;
                                                                }

                                                                if (content && typeof editor.addComponents === 'function') {
                                                                    const wrapper = editor.getWrapper?.() || editor;
                                                                    wrapper.append(content);
                                                                }
                                                            }}
                                                            className={`border rounded-md p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:shadow-sm transition-all bg-white group relative ${group.category ? 'aspect-square' : 'py-6'}`}
                                                        >
                                                            <div className="absolute top-1 flex space-x-0.5 text-gray-300 opacity-50">
                                                                {/* Dots indicator mimicking grapes grip */}
                                                                <div className="w-1 h-1 rounded-full bg-current"></div>
                                                                <div className="w-1 h-1 rounded-full bg-current"></div>
                                                                <div className="w-1 h-1 rounded-full bg-current"></div>
                                                                <div className="w-1 h-1 rounded-full bg-current"></div>
                                                            </div>
                                                            {item.isNew && (
                                                                <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 border-none px-1 text-[9px]">
                                                                    Novo
                                                                </Badge>
                                                            )}
                                                            {item.icon}
                                                            <span className="text-[11px] text-gray-600 font-medium leading-tight group-hover:text-blue-600 mt-1">
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Extra padding to ensure scrolling works well */}
                                    <div className="h-12"></div>
                                </ScrollArea>
                            </div>
                        </>
                    )
                    }
                </div >
            )}
        </div >
    )
}
