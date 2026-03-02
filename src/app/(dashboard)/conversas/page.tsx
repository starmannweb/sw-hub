"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Search, Filter, MoreHorizontal, Phone, Video, Info,
    Paperclip, Smile, Send, Mic, Image as ImageIcon,
    Check, CheckCheck, CircleUser, Tag, Briefcase, Calendar,
    MessageSquare, DollarSign, Plus, X
} from "lucide-react"

// Mock Data
const chats = [
    {
        id: 1,
        name: "Carlos Silva",
        avatar: "CS",
        lastMessage: "Olá, gostaria de saber mais sobre os planos do CRM.",
        time: "10:42",
        unread: 2,
        platform: "whatsapp",
        status: "recent",
        phone: "+55 11 99999-9999",
        email: "carlos.silva@empresa.com",
        tags: ["Lead Quente", "B2B"],
        pipeline: "Vendas - B2B",
        stage: "Em Negociação"
    },
    {
        id: 2,
        name: "Ana Oliveira",
        avatar: "AO",
        lastMessage: "Perfeito, vou enviar o comprovante de pagamento.",
        time: "Ontem",
        unread: 0,
        platform: "instagram",
        status: "recent",
        phone: "+55 21 98888-8888",
        email: "ana.oly@gmail.com",
        tags: ["Cliente", "VIP"],
        pipeline: "Pós-Venda",
        stage: "Onboarding"
    },
    {
        id: 3,
        name: "Roberto Mendes",
        avatar: "RM",
        lastMessage: "Vocês fazem integração com ERP?",
        time: "Segunda",
        unread: 0,
        platform: "messenger",
        status: "all",
        phone: "+55 31 97777-7777",
        email: "roberto@techmendes.com.br",
        tags: ["Dúvida Técnica"],
        pipeline: "Vendas - B2B",
        stage: "Novo Lead"
    }
]

const messages = [
    { id: 1, text: "Olá! Tudo bem? Vi que vocês tem uma plataforma de CRM.", sender: 'client', time: "10:30", type: 'text' },
    { id: 2, text: "Olá Carlos! Tudo ótimo por aqui. Temos sim, o Triia Hub. Como posso te ajudar hoje?", sender: 'agent', time: "10:35", type: 'text' },
    { id: 3, text: "Gostaria de saber mais sobre os planos do CRM. Preciso integrar com meu WhatsApp.", sender: 'client', time: "10:42", type: 'text' },
]

export default function ConversasPage() {
    const [activeChat, setActiveChat] = useState(chats[0])
    const [messageInput, setMessageInput] = useState("")

    return (
        <div className="flex-1 h-[calc(100vh-4rem)] p-4 md:p-6 overflow-hidden">
            <div className="flex h-full gap-4 max-w-[1600px] mx-auto">

                {/* 1. LEFT PANEL - CHAT LIST */}
                <Card className="w-full md:w-[320px] lg:w-[380px] flex shrink-0 flex-col overflow-hidden border shadow-sm">
                    <div className="p-4 border-b space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight">Conversas</h2>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar contatos ou mensagens..." className="pl-8 bg-muted/40" />
                        </div>
                    </div>

                    <Tabs defaultValue="recents" className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-4 pt-2">
                            <TabsList className="w-full grid grid-cols-3">
                                <TabsTrigger value="unread" className="text-xs">Não Lidas</TabsTrigger>
                                <TabsTrigger value="recents" className="text-xs">Recentes</TabsTrigger>
                                <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="recents" className="flex-1 overflow-y-auto m-0 mt-2 p-0">
                            <div className="flex flex-col">
                                {chats.map((chat) => (
                                    <button
                                        key={chat.id}
                                        onClick={() => setActiveChat(chat)}
                                        className={`flex items-start gap-3 p-4 text-left transition-colors border-l-2 hover:bg-muted/50 ${activeChat.id === chat.id ? 'border-l-primary bg-primary/5' : 'border-l-transparent'}`}
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border flex items-center justify-center text-sm font-semibold shrink-0">
                                                {chat.avatar}
                                            </div>
                                            {chat.platform === 'whatsapp' && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
                                                    <MessageSquare className="w-2 h-2 text-white fill-current" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className={`text-sm font-semibold truncate ${chat.unread > 0 ? 'text-foreground' : 'text-foreground/80'}`}>{chat.name}</span>
                                                <span className="text-xs text-muted-foreground shrink-0">{chat.time}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`text-xs truncate ${chat.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                                    {chat.lastMessage}
                                                </span>
                                                {chat.unread > 0 && (
                                                    <Badge className="h-5 min-w-5 shrink-0 rounded-full bg-primary flex items-center justify-center px-1 text-[10px]">
                                                        {chat.unread}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>

                {/* 2. CENTER PANEL - CHAT AREA */}
                <Card className="flex-1 flex flex-col overflow-hidden border shadow-sm hidden md:flex relative">
                    {/* Chat Header */}
                    <div className="h-16 px-6 border-b flex items-center justify-between bg-card/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border flex items-center justify-center text-sm font-semibold">
                                {activeChat.avatar}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold flex items-center gap-2">
                                    {activeChat.name}
                                    <Badge variant="outline" className="text-[10px] uppercase font-normal py-0 px-1.5 h-4 bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10">WhatsApp</Badge>
                                </h3>
                                <p className="text-xs text-muted-foreground">{activeChat.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="hidden lg:flex"><DollarSign className="w-4 h-4 mr-2 text-emerald-600" /> Cobrar</Button>
                            <Button variant="ghost" size="icon"><Phone className="w-4 h-4 text-muted-foreground" /></Button>
                            <Button variant="ghost" size="icon"><Video className="w-4 h-4 text-muted-foreground" /></Button>
                            <Button variant="ghost" size="icon" className="lg:hidden"><Info className="w-4 h-4 text-muted-foreground" /></Button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <ScrollArea className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20">
                        <div className="space-y-6">
                            <div className="text-center">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">Hoje</span>
                            </div>

                            {messages.map((msg) => {
                                const isAgent = msg.sender === 'agent'
                                return (
                                    <div key={msg.id} className={`flex flex-col max-w-[75%] ${isAgent ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                                        <div className={`p-3 rounded-2xl ${isAgent ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white dark:bg-slate-800 border shadow-sm text-foreground rounded-tl-sm'}`}>
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 px-1">
                                            <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                                            {isAgent && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>

                    {/* Chat Input */}
                    <div className="p-4 bg-card border-t shrink-0">
                        <div className="flex items-end gap-2 bg-muted/30 border rounded-xl focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all p-2">
                            <div className="flex flex-col gap-2 shrink-0 pb-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></Button>
                            </div>
                            <textarea
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Digite sua mensagem. Pressione Ctrl+Enter para quebrar linha."
                                className="flex-1 max-h-[150px] min-h-[44px] bg-transparent resize-none border-0 focus:ring-0 p-2 text-sm"
                                rows={1}
                            />
                            <div className="flex items-center gap-1 shrink-0 pb-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Smile className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Mic className="w-4 h-4" /></Button>
                                <div className="w-px h-6 bg-border mx-1"></div>
                                <Button className="h-8 w-8 rounded-full" size="icon"><Send className="w-3.5 h-3.5 -ml-0.5" /></Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 px-2">
                            <div className="text-[10px] text-muted-foreground flex gap-4">
                                <button className="hover:text-primary transition-colors">Usar Template ( / )</button>
                                <button className="hover:text-primary transition-colors">Variáveis ( {`{}`} )</button>
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                Enter para enviar
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 3. RIGHT PANEL - CONTACT INFO (TriiaHub Style) */}
                <Card className="w-[300px] xl:w-[350px] flex flex-col overflow-hidden border shadow-sm hidden lg:flex shrink-0">
                    <div className="h-16 px-6 border-b flex items-center bg-card/50 shrink-0">
                        <h3 className="font-bold">Detalhes do Contato</h3>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-6 space-y-8">
                            {/* Profile Highlight */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-background shadow-sm flex items-center justify-center text-2xl font-bold mb-3">
                                    {activeChat.avatar}
                                </div>
                                <h2 className="text-xl font-bold">{activeChat.name}</h2>
                                <p className="text-sm text-muted-foreground">{activeChat.email}</p>
                                <div className="flex gap-2 mt-4">
                                    <Button variant="outline" size="sm" className="h-8 text-xs"><Phone className="w-3 h-3 mr-1" /> Ligar</Button>
                                    <Button variant="outline" size="sm" className="h-8 text-xs"><Plus className="w-3 h-3 mr-1" /> Tarefa</Button>
                                </div>
                            </div>

                            {/* Tags / Labels */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <span>Tags</span>
                                    <Button variant="ghost" size="icon" className="h-5 w-5"><Plus className="w-3 h-3" /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {activeChat.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="font-normal border hover:bg-muted/50 text-[10px] h-5 py-0">
                                            {tag} <X className="w-3 h-3 ml-1 opacity-50 hover:opacity-100 cursor-pointer" />
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Opportunities / CRM Link */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <span>Negócios (Deals)</span>
                                    <Button variant="ghost" size="icon" className="h-5 w-5"><Plus className="w-3 h-3" /></Button>
                                </div>

                                <div className="p-3 bg-muted/40 border rounded-lg hover:border-primary/50 cursor-pointer transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-sm">Design Website Institucional</span>
                                        <span className="text-xs font-bold text-emerald-600">R$ 3.500</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                                        <Briefcase className="w-3 h-3" /> {activeChat.pipeline}
                                    </div>
                                    <div className="mt-2 text-xs font-medium text-primary">
                                        → {activeChat.stage}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Info Form Fields */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <span>Informações Base</span>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-[10px] text-muted-foreground uppercase font-semibold">Telefone</label>
                                        <Input defaultValue={activeChat.phone} className="h-8 text-xs bg-muted/20 border-transparent hover:border-border mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground uppercase font-semibold">Empresa</label>
                                        <Input defaultValue="Empresa Teste LTDA" className="h-8 text-xs bg-muted/20 border-transparent hover:border-border mt-1" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </ScrollArea>
                </Card>

            </div>
        </div>
    )
}
