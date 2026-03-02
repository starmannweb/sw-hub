"use client"

import React, { useState } from "react"
import { X, Type, ChevronDown, Check, Image as ImageIcon, Monitor, Smartphone, Copy, Plus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Square, Circle, Minus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface RightSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    editor?: any;
}

export function RightSidebar({ isOpen, onClose, editor }: RightSidebarProps) {
    const [selectedElement, setSelectedElement] = useState<any>(null);

    React.useEffect(() => {
        if (!editor) return;

        const updateSelected = () => {
            const selected = editor.getSelected();
            setSelectedElement(selected);
        };

        editor.on('component:selected', updateSelected);
        editor.on('component:deselected', updateSelected);
        editor.on('component:update', updateSelected);

        return () => {
            editor.off('component:selected', updateSelected);
            editor.off('component:deselected', updateSelected);
            editor.off('component:update', updateSelected);
        };
    }, [editor]);

    if (!isOpen) return null

    // Determine title based on selection
    const elementTitle = selectedElement ? (selectedElement.get('name') || selectedElement.get('type') || 'Elemento') : 'Nenhuma seleção';

    const handleStyleChange = (property: string, value: string) => {
        if (!selectedElement) return;
        const currentStyles = selectedElement.getStyle() || {};
        if (value) {
            currentStyles[property] = value;
        } else {
            delete currentStyles[property]; // remove if empty
        }
        selectedElement.setStyle(currentStyles);
        // Force state update to re-render UI with new values if needed
        setSelectedElement(editor.getSelected());
    };

    const getStyleValue = (property: string, defaultValue: string = '') => {
        if (!selectedElement) return defaultValue;
        const styles = selectedElement.getStyle() || {};
        return styles[property] || defaultValue;
    };

    const parsePx = (val: string) => val ? parseInt(val.replace('px', '')) || 0 : 0;

    return (
        <div className="w-[340px] shrink-0 border-l bg-white shadow-xl z-10 flex flex-col overflow-hidden h-full">
            <div className="p-3 py-2 flex items-center justify-between border-b bg-gray-50/50">
                <span className="font-semibold text-gray-700 text-sm capitalize">{elementTitle}</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                </button>
            </div>

            <Tabs defaultValue="geral" className="w-full h-full flex flex-col pt-2">
                <TabsList className="grid w-full grid-cols-3 bg-transparent h-9 px-2 mb-2">
                    <TabsTrigger value="geral" className="text-[11px] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent px-1">
                        Geral
                    </TabsTrigger>
                    <TabsTrigger value="estilos" className="text-[11px] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent px-1">
                        Estilos
                    </TabsTrigger>
                    <TabsTrigger value="animacoes" className="text-[11px] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent px-1">
                        Animações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="geral" className="flex-1 overflow-y-auto mt-0">
                    <div className="px-4 space-y-4 mt-4 mb-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500 font-normal">Nome do elemento</Label>
                            <Input
                                value={selectedElement ? (selectedElement.get('name') || selectedElement.get('type') || '') : ''}
                                onChange={(e) => {
                                    if (selectedElement) {
                                        selectedElement.set('name', e.target.value);
                                        setSelectedElement(selectedElement); // trigger re-render
                                    }
                                }}
                                disabled={!selectedElement}
                                className="h-8 text-sm border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500 font-normal">Persistente</Label>
                            <Select defaultValue="sem-fixacao">
                                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                <SelectContent><SelectItem value="sem-fixacao">Sem fixação</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <Label className="text-[11px] text-gray-600 font-normal max-w-[200px] leading-tight">Permita que as linhas ocupem toda a largura</Label>
                            <Switch />
                        </div>
                    </div>

                    <Accordion type="multiple" defaultValue={["plano-de-fundo", "largura"]} className="w-full">
                        <AccordionItem value="plano-de-fundo" className="border-b-0 border-t border-gray-100 px-4">
                            <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline text-gray-700">
                                Plano de fundo
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 space-y-4">
                                <div className="flex rounded-md border border-gray-200 bg-white p-1">
                                    <button className="flex-1 py-1 text-xs font-medium rounded shadow-sm bg-white text-gray-800">Cor</button>
                                    <button className="flex-1 py-1 text-xs font-medium rounded text-gray-500 hover:text-gray-700">Imagem</button>
                                    <button className="flex-1 py-1 text-xs font-medium rounded text-gray-500 hover:text-gray-700">Vídeo</button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-gray-500 font-normal">Gradiente</Label>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-gray-500 font-normal max-w-[150px] leading-tight">Cor do plano de fundo</Label>
                                    <div className="w-6 h-6 rounded border border-gray-200 cursor-pointer bg-[#0f172a]"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-gray-500 font-normal">Desfoque do plano de fundo</Label>
                                    <Switch />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="largura" className="border-b-0 border-t border-gray-100 px-4">
                            <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline text-gray-700">
                                Largura
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-gray-500">Largura</Label>
                                    <Select defaultValue="completo">
                                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                        <SelectContent><SelectItem value="completo">Completo</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TabsContent>

                <TabsContent value="estilos" className="flex-1 overflow-y-auto mt-0">
                    <Accordion type="multiple" defaultValue={["config-menu", "bg-color", "border-corner", "shadow", "align", "container-size", "visibility"]} className="w-full">

                        {/* Configuração de menu */}
                        <AccordionItem value="config-menu" className="border-b-0 border-t border-gray-100 px-4">
                            <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline text-gray-700">
                                Configuração de menu
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 space-y-4">
                                <Tabs defaultValue="menu" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-transparent h-8 mb-2">
                                        <TabsTrigger value="menu" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent">Menu</TabsTrigger>
                                        <TabsTrigger value="submenu" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent">Submenu</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="menu" className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs text-gray-500 font-normal">Margem e espaçamento</Label>
                                                <Monitor className="h-4 w-4 text-gray-400" />
                                            </div>
                                            {/* Box Model Map */}
                                            <div className="relative border border-dashed border-gray-300 rounded-sm bg-gray-50 p-2 text-center text-[10px] text-gray-400">
                                                MARGEM
                                                <div className="flex items-center justify-between px-2 mt-1">
                                                    <input
                                                        type="number"
                                                        className="w-10 text-[10px] text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:bg-white text-gray-700 disabled:opacity-50"
                                                        value={parsePx(getStyleValue('margin-left'))}
                                                        onChange={(e) => handleStyleChange('margin-left', `${e.target.value}px`)}
                                                        disabled={!selectedElement}
                                                    />
                                                    <div className="bg-white border border-gray-200 w-28 h-18 flex items-center justify-center p-1 relative">
                                                        <span className="absolute top-0 text-[8px] text-gray-400 w-full text-center">PADDING</span>
                                                        <input
                                                            type="number"
                                                            className="absolute top-2 w-10 text-[10px] text-center bg-transparent hover:bg-gray-50 focus:outline-none focus:bg-white text-gray-700 disabled:opacity-50"
                                                            value={parsePx(getStyleValue('padding-top'))}
                                                            onChange={(e) => handleStyleChange('padding-top', `${e.target.value}px`)}
                                                            disabled={!selectedElement}
                                                        />
                                                        <input
                                                            type="number"
                                                            className="absolute bottom-1 w-10 text-[10px] text-center bg-transparent hover:bg-gray-50 focus:outline-none focus:bg-white text-gray-700 disabled:opacity-50"
                                                            value={parsePx(getStyleValue('padding-bottom'))}
                                                            onChange={(e) => handleStyleChange('padding-bottom', `${e.target.value}px`)}
                                                            disabled={!selectedElement}
                                                        />
                                                        <input
                                                            type="number"
                                                            className="absolute left-1 top-4 w-6 text-[10px] text-center bg-transparent hover:bg-gray-50 focus:outline-none focus:bg-white text-gray-700 disabled:opacity-50"
                                                            value={parsePx(getStyleValue('padding-left'))}
                                                            onChange={(e) => handleStyleChange('padding-left', `${e.target.value}px`)}
                                                            disabled={!selectedElement}
                                                        />
                                                        <input
                                                            type="number"
                                                            className="absolute right-1 top-4 w-6 text-[10px] text-center bg-transparent hover:bg-gray-50 focus:outline-none focus:bg-white text-gray-700 disabled:opacity-50"
                                                            value={parsePx(getStyleValue('padding-right'))}
                                                            onChange={(e) => handleStyleChange('padding-right', `${e.target.value}px`)}
                                                            disabled={!selectedElement}
                                                        />
                                                        <div className="border border-solid border-gray-300 w-12 h-6 bg-gray-100 mt-2 flex items-center justify-center text-gray-400"></div>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        className="w-10 text-[10px] text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:bg-white text-gray-700 disabled:opacity-50"
                                                        value={parsePx(getStyleValue('margin-right'))}
                                                        onChange={(e) => handleStyleChange('margin-right', `${e.target.value}px`)}
                                                        disabled={!selectedElement}
                                                    />
                                                </div>
                                                <div className="flex justify-center mt-1 absolute top-0 w-full left-0">
                                                    <input
                                                        type="number"
                                                        className="w-10 text-[10px] text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:bg-white text-gray-700 disabled:opacity-50"
                                                        value={parsePx(getStyleValue('margin-top'))}
                                                        onChange={(e) => handleStyleChange('margin-top', `${e.target.value}px`)}
                                                        disabled={!selectedElement}
                                                    />
                                                </div>
                                                <div className="flex justify-center mt-1">
                                                    <input
                                                        type="number"
                                                        className="w-10 text-[10px] text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:bg-white text-gray-700 disabled:opacity-50"
                                                        value={parsePx(getStyleValue('margin-bottom'))}
                                                        onChange={(e) => handleStyleChange('margin-bottom', `${e.target.value}px`)}
                                                        disabled={!selectedElement}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-gray-500 font-normal">Alinhamento de itens do menu</Label>
                                            <div className="flex rounded-md border border-gray-200 bg-white">
                                                <button className="flex-1 py-1.5 flex items-center justify-center border-r hover:bg-gray-50 text-blue-600"><AlignLeft className="h-4 w-4" /></button>
                                                <button className="flex-1 py-1.5 flex items-center justify-center border-r hover:bg-gray-50"><AlignCenter className="h-4 w-4 text-gray-500" /></button>
                                                <button className="flex-1 py-1.5 flex items-center justify-center hover:bg-gray-50"><AlignRight className="h-4 w-4 text-gray-500" /></button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-gray-500 font-normal">Espaçamento de itens do menu</Label>
                                            <div className="flex items-center gap-2">
                                                <input type="range" className="flex-1 accent-blue-600" defaultValue={25} min={0} max={100} />
                                                <div className="flex items-center border rounded px-2 h-8 bg-white">
                                                    <input type="number" className="w-[30px] text-xs text-center outline-none" defaultValue={25} />
                                                    <span className="text-xs text-gray-500">px</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="submenu"></TabsContent>
                                </Tabs>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Plano de fundo e cor */}
                        <AccordionItem value="bg-color" className="border-b-0 border-t border-gray-100 px-4">
                            <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline text-gray-700">
                                Plano de fundo e cor
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 space-y-4">
                                <Tabs defaultValue="menu" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-transparent h-8 mb-2">
                                        <TabsTrigger value="menu" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent">Menu</TabsTrigger>
                                        <TabsTrigger value="submenu" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent">Submenu</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="menu" className="space-y-3">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center bg-white p-1 rounded hover:bg-gray-50">
                                                <Label className="text-xs text-gray-500 font-normal max-w-[200px] leading-tight">Cor do plano de fundo</Label>
                                                <input
                                                    type="color"
                                                    className="w-6 h-6 p-0 border-0 rounded cursor-pointer disabled:opacity-50 appearance-none bg-transparent"
                                                    value={getStyleValue('background-color')}
                                                    onChange={(e) => handleStyleChange('background-color', e.target.value)}
                                                    disabled={!selectedElement}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center bg-white p-1 rounded hover:bg-gray-50">
                                                <Label className="text-xs text-gray-500 font-normal max-w-[200px] leading-tight">Cor do texto</Label>
                                                <input
                                                    type="color"
                                                    className="w-6 h-6 p-0 border-0 rounded cursor-pointer disabled:opacity-50 appearance-none bg-transparent"
                                                    value={getStyleValue('color')}
                                                    onChange={(e) => handleStyleChange('color', e.target.value)}
                                                    disabled={!selectedElement}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="submenu"></TabsContent>
                                </Tabs>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Borda e Canto */}
                        <AccordionItem value="border-corner" className="border-b-0 border-t border-gray-100 px-4">
                            <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline text-gray-700">
                                Borda e canto
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 space-y-4">
                                <Tabs defaultValue="menu" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-transparent h-8 mb-2">
                                        <TabsTrigger value="menu" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent">Menu</TabsTrigger>
                                        <TabsTrigger value="submenu" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent">Submenu</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="menu" className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-500 font-normal">Espessura</Label>
                                                <div className="flex items-center border rounded px-2 h-8 bg-white">
                                                    <input type="number" className="flex-1 text-xs outline-none" defaultValue={0} />
                                                    <span className="text-xs text-gray-500">px</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2 flex flex-col items-center">
                                                <Label className="text-xs text-gray-500 font-normal self-start">Cor da borda</Label>
                                                <div className="flex items-center gap-2 mt-1 self-start cursor-pointer border rounded-md p-1 pl-2 pr-3 h-8 bg-white">
                                                    <div className="w-4 h-4 rounded-full bg-black"></div>
                                                    <span className="text-xs text-gray-600">#000000</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-gray-500 font-normal">Raio do canto</Label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center border rounded px-2 h-8 bg-white flex-1 max-w-[80px]">
                                                    <input type="number" className="w-[30px] text-xs text-center outline-none" defaultValue={0} />
                                                    <span className="text-xs text-gray-500">px</span>
                                                </div>
                                                <input type="range" className="flex-1 accent-gray-300" defaultValue={0} min={0} max={100} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-gray-500 font-normal">Estilo de borda</Label>
                                            <div className="flex gap-2">
                                                <button className="h-8 w-10 flex items-center justify-center border rounded-md border-blue-500 bg-blue-50 text-blue-600"><Square className="h-4 w-4" /></button>
                                                <button className="h-8 w-10 flex items-center justify-center border rounded-md bg-white hover:bg-gray-50"><Minus className="h-4 w-4 text-gray-500" /></button>
                                                <button className="h-8 w-10 flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-white hover:bg-gray-50"><Minus className="h-4 w-4 text-gray-400" /></button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="submenu"></TabsContent>
                                </Tabs>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Sombra */}
                        <AccordionItem value="shadow" className="border-b-0 border-t border-gray-100 px-4">
                            <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline text-gray-700">
                                Sombra
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <Tabs defaultValue="menu" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-transparent h-8 mb-2">
                                        <TabsTrigger value="menu" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent">Menu</TabsTrigger>
                                        <TabsTrigger value="submenu" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent">Submenu</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="menu">
                                        <div className="flex items-center justify-between mt-2">
                                            <Label className="text-xs text-gray-500 font-normal">Efeito de sombra</Label>
                                            <button className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-100"><Plus className="h-4 w-4 text-gray-400" /></button>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="submenu"></TabsContent>
                                </Tabs>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Alinhar */}
                        <AccordionItem value="align" className="border-b-0 border-t border-gray-100 px-4">
                            <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline text-gray-700">
                                Alinhar
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs text-gray-500 font-normal">Alinhamento de texto</Label>
                                        <Monitor className="h-3 w-3 text-gray-400" />
                                    </div>
                                    <div className="flex rounded-md border border-gray-200 bg-white overflow-hidden">
                                        <button onClick={() => handleStyleChange('text-align', 'left')} disabled={!selectedElement} className={`flex-1 py-1.5 flex items-center justify-center border-r hover:bg-gray-50 ${getStyleValue('text-align') === 'left' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}><AlignLeft className="h-4 w-4" /></button>
                                        <button onClick={() => handleStyleChange('text-align', 'center')} disabled={!selectedElement} className={`flex-1 py-1.5 flex items-center justify-center border-r hover:bg-gray-50 ${getStyleValue('text-align') === 'center' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}><AlignCenter className="h-4 w-4" /></button>
                                        <button onClick={() => handleStyleChange('text-align', 'right')} disabled={!selectedElement} className={`flex-1 py-1.5 flex items-center justify-center border-r hover:bg-gray-50 ${getStyleValue('text-align') === 'right' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}><AlignRight className="h-4 w-4" /></button>
                                        <button onClick={() => handleStyleChange('text-align', 'justify')} disabled={!selectedElement} className={`flex-1 py-1.5 flex items-center justify-center hover:bg-gray-50 ${getStyleValue('text-align') === 'justify' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}><AlignJustify className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Tamanho do recipiente */}
                        <AccordionItem value="container-size" className="border-b-0 border-t border-gray-100 px-4">
                            <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline text-gray-700 flex justify-between">
                                Tamanho do recipiente
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-gray-500">Largura</Label>
                                        <Input
                                            className="h-8 text-xs text-gray-600 bg-white"
                                            value={getStyleValue('width')}
                                            placeholder="auto"
                                            onChange={(e) => handleStyleChange('width', e.target.value)}
                                            disabled={!selectedElement}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-gray-500">Altura</Label>
                                        <Input
                                            className="h-8 text-xs text-gray-600 bg-white"
                                            value={getStyleValue('height')}
                                            placeholder="auto"
                                            onChange={(e) => handleStyleChange('height', e.target.value)}
                                            disabled={!selectedElement}
                                        />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Visibilidade */}
                        <AccordionItem value="visibility" className="border-b-0 border-t border-gray-100 px-4">
                            <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline text-gray-700">
                                Visibilidade
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 space-y-4">
                                <div className="flex gap-4">
                                    <button className="h-14 flex-1 flex flex-col items-center justify-center border-2 border-blue-500 rounded-md bg-blue-50/30 text-blue-600 relative">
                                        <Monitor className="h-6 w-6 mb-1" />
                                        <Check className="h-3 w-3 absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5" />
                                    </button>
                                    <button className="h-14 flex-1 flex flex-col items-center justify-center border-2 border-blue-500 rounded-md bg-blue-50/30 text-blue-600 relative">
                                        <Smartphone className="h-6 w-6 mb-1" />
                                        <Check className="h-3 w-3 absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5" />
                                    </button>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label className="text-[10px] text-gray-500">Classe personalizada</Label>
                                    <Input placeholder="Insira o nome da classe" className="h-8 text-xs border-gray-200" />
                                    <p className="text-[9px] text-gray-400">Pressione Enter para adicionar uma classe</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-gray-500">Seletor CSS</Label>
                                    <div className="flex border border-gray-200 rounded-md">
                                        <div className="flex-1 px-2 py-1.5 text-xs text-gray-600 bg-gray-50 overflow-hidden text-ellipsis whitespace-nowrap">
                                            #nav-menu-v2-XJCH20xGY1
                                        </div>
                                        <button className="px-2 border-l hover:bg-gray-100 text-gray-500"><Copy className="h-3 w-3" /></button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </TabsContent>
                <TabsContent value="animacoes" className="flex-1 overflow-y-auto mt-0 px-2 py-4">
                    <div className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer shadow-sm relative group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1 rounded bg-blue-50 text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium text-gray-800">Animação de entrada</p>
                                    <p className="text-[10px] text-gray-500">Animação: <span className="text-gray-900">Desvanecer Para cima</span> <button className="text-blue-600 hover:text-blue-800">Limpar</button></p>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right text-gray-400"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                    </div>
                </TabsContent>
            </Tabs >
        </div >
    )
}
