"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Upload, Globe, Code, ChevronRight, Loader2, ArrowLeft } from "lucide-react"

type Method = "file" | "url" | "code" | null

export default function ReplicatePage() {
    const router = useRouter()
    const supabase = createClient()
    const [step, setStep] = useState(1)

    // Step 1: Method
    const [method, setMethod] = useState<Method>(null)

    // Step 2: Destination
    const [sites, setSites] = useState<any[]>([])
    const [selectedSiteId, setSelectedSiteId] = useState<string>("")
    const [isMainPage, setIsMainPage] = useState(false)
    const [pageSlug, setPageSlug] = useState("")

    // Step 3: Source Content
    const [sourceUrl, setSourceUrl] = useState("")
    const [sourceCode, setSourceCode] = useState("")
    const [sourceFile, setSourceFile] = useState<File | null>(null)

    // Global UI
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load Sites for Step 2
    useEffect(() => {
        const fetchSites = async () => {
            const { data } = await supabase.from('sites').select('id, name')
            if (data) setSites(data)
        }
        fetchSites()
    }, [])

    const handleNextStep = () => {
        if (step === 1 && !method) {
            setError("Selecione um método de importação.")
            return
        }
        if (step === 2 && (!selectedSiteId || (!isMainPage && !pageSlug))) {
            setError("Preencha todos os campos do site de destino.")
            return
        }
        if (step === 3) {
            if (method === 'url' && !sourceUrl) return setError("Insira a URL.")
            if (method === 'code' && !sourceCode) return setError("Insira o código HTML.")
            if (method === 'file' && !sourceFile) return setError("Faça o upload do arquivo.")

            // Proceed to Step 4 and start Replication
            startReplication()
            return
        }

        setError(null)
        setStep(s => s + 1)
    }

    const startReplication = async () => {
        setStep(4)
        setLoading(true)
        setError(null)

        try {
            let htmlContent = ""
            let cssContent = ""

            // Handle URL Method
            if (method === 'url') {
                const response = await fetch('/api/scrape', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: sourceUrl })
                })

                if (!response.ok) {
                    throw new Error("Falha ao escrapear a URL. O site pode estar bloqueando a requisição.")
                }

                const result = await response.json()
                htmlContent = result.html
                // cssContent = result.css
            }

            // Handle Code Method
            else if (method === 'code') {
                htmlContent = sourceCode
            }

            // Handle File Method
            else if (method === 'file' && sourceFile) {
                const text = await sourceFile.text()
                htmlContent = text
            }

            // Create Page in DB
            const finalSlug = isMainPage ? 'index' : pageSlug.trim().replace(/\s+/g, '-')

            const { data, error: insertError } = await supabase.from('site_pages').insert({
                site_id: selectedSiteId,
                name: finalSlug,
                slug: finalSlug,
                is_home: isMainPage,
                content: { html: htmlContent, css: cssContent }, // Basic format for GrapesJS MVP
            }).select('id').single()

            if (insertError) {
                console.error(insertError)
                if (insertError.code === '23505') throw new Error("Aviso: Já existe uma página com este URL neste site. Tente outro Slug.")
                throw new Error("Erro ao salvar no banco de dados.")
            }

            // Also save locally so the beta builder can load it instantly as MVP
            localStorage.setItem('site_clone_data', JSON.stringify({ html: htmlContent, css: cssContent, pageId: data.id }))

            // Redirect to editor
            router.push(`/sites/${selectedSiteId}/pages/${data.id}/editor`)

        } catch (err: any) {
            setError(err.message || 'Erro durante a replicação.')
            setStep(3) // Volta pro input
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 min-h-screen bg-[#0b0b10] text-[#e4e4e7] p-8 font-sans">

            {/* Header / Stepper Progress */}
            <div className="max-w-4xl mx-auto mb-16">
                <button onClick={() => step > 1 ? setStep(step - 1) : router.push('/sites')} className="flex items-center text-[#71717a] hover:text-white transition-colors mb-10 text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </button>

                <div className="flex items-center justify-between relative px-4">
                    {/* Line behind steps */}
                    <div className="absolute top-[16px] left-[10%] right-[10%] h-[2px] bg-[#292932] -z-10 rounded-full"></div>
                    <div className="absolute top-[16px] left-[10%] h-[2px] bg-[#8b5cf6] -z-10 transition-all duration-500 rounded-full"
                        style={{ width: `${((step - 1) / 3) * 80}%` }}></div>

                    {[
                        { id: 1, label: 'Selecionar' },
                        { id: 2, label: 'Configurar Site' },
                        { id: 3, label: 'Replicar Site' },
                        { id: 4, label: 'Personalizar' },
                    ].map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-3">
                            <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center font-medium text-[15px] transition-all
                                ${step >= s.id ? 'bg-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-[#0b0b10] border border-[#292932] text-[#71717a]'}`}>
                                {s.id}
                            </div>
                            <span className={`text-[13px] font-semibold tracking-wide ${step >= s.id ? 'text-white' : 'text-[#52525b]'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-3xl mx-auto flex flex-col items-center">

                {step === 1 && (
                    <div className="w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-3xl font-bold text-white mb-2">Crie sua página em segundos com o clonador!</h1>
                        <p className="text-[#a1a1aa] mb-12">Escolha uma das opções abaixo para capturar o esqueleto de um site alvo.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Card - File */}
                            <div
                                onClick={() => { setMethod('file'); setError(null) }}
                                className={`bg-[#1c1c22] border-2 rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer transition-all hover:-translate-y-1 shadow-xl
                                ${method === 'file' ? 'border-[#8b5cf6] bg-[#2e1065] bg-opacity-20' : 'border-[#232329] hover:border-[#3f3f46]'}`}
                            >
                                <div className="w-16 h-16 bg-[#232329] rounded-2xl flex items-center justify-center mb-6 text-[#8b5cf6] shadow-inner">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Importar Arquivo</h3>
                                <p className="text-sm text-[#71717a]">Carregue um arquivo .html da sua máquina</p>
                            </div>

                            {/* Card - URL */}
                            <div
                                onClick={() => { setMethod('url'); setError(null) }}
                                className={`bg-[#1c1c22] border-2 rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer transition-all hover:-translate-y-1 shadow-xl
                                ${method === 'url' ? 'border-[#8b5cf6] bg-[#2e1065] bg-opacity-20' : 'border-[#232329] hover:border-[#3f3f46]'}`}
                            >
                                <div className="w-16 h-16 bg-[#232329] rounded-2xl flex items-center justify-center mb-6 text-[#8b5cf6] shadow-inner">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Importar URL</h3>
                                <p className="text-sm text-[#71717a]">Importe uma página existente digitando sua URL pública</p>
                            </div>

                            {/* Card - Code */}
                            <div
                                onClick={() => { setMethod('code'); setError(null) }}
                                className={`bg-[#1c1c22] border-2 rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer transition-all hover:-translate-y-1 shadow-xl
                                ${method === 'code' ? 'border-[#8b5cf6] bg-[#2e1065] bg-opacity-20' : 'border-[#232329] hover:border-[#3f3f46]'}`}
                            >
                                <div className="w-16 h-16 bg-[#232329] rounded-2xl flex items-center justify-center mb-6 text-[#8b5cf6] shadow-inner">
                                    <Code className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Colar Código HTML</h3>
                                <p className="text-sm text-[#71717a]">Cole a estrutura de tags nativa da página origem</p>
                            </div>

                        </div>
                    </div>
                )}


                {step === 2 && (
                    <div className="w-full max-w-2xl bg-[#1c1c22] border border-[#232329] rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                        <h2 className="text-2xl font-bold text-white mb-2">Destino do Site</h2>
                        <p className="text-[#a1a1aa] mb-8">Defina em qual projeto a página será injetada e qual o caminho / URL final.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[#c4c4ce] mb-2">Selecionar Projeto Pai</label>
                                <select
                                    className="w-full bg-[#0b0b10] border border-[#31313a] rounded-xl px-4 py-3 text-[#e4e4e7] focus:border-[#8b5cf6] focus:outline-none appearance-none"
                                    value={selectedSiteId}
                                    onChange={(e) => setSelectedSiteId(e.target.value)}
                                >
                                    <option value="" disabled>Escolha um projeto existente...</option>
                                    {sites.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {sites.length === 0 && <p className="text-xs text-[#ef4444] mt-2">Você precisa criar ao menos um Site na gerência primeiro.</p>}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#0b0b10] border border-[#31313a] rounded-xl">
                                <div>
                                    <p className="text-sm font-medium text-white mb-1">Esta é a Página Principal?</p>
                                    <p className="text-xs text-[#71717a]">Ela será a home page raiz (ex. seu-site.com/)</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={isMainPage} onChange={() => setIsMainPage(p => !p)} />
                                    <div className="w-11 h-6 bg-[#31313a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
                                </label>
                            </div>

                            {!isMainPage && (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="block text-sm font-medium text-[#c4c4ce] mb-2">Digite o Slug da Página</label>
                                    <div className="flex bg-[#0b0b10] border border-[#31313a] rounded-xl overflow-hidden focus-within:border-[#8b5cf6]">
                                        <span className="bg-[#16161a] text-[#71717a] px-4 py-3 border-r border-[#31313a] text-sm flex items-center">
                                            /
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="nova-oferta-vsl"
                                            className="w-full bg-transparent px-4 py-3 text-[#f4f4f5] focus:outline-none text-sm"
                                            value={pageSlug}
                                            onChange={(e) => setPageSlug(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-[11px] text-[#71717a] mt-2">Dica: use hifens para separar palavras, sem espaços ou acentos.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {step === 3 && (
                    <div className="w-full max-w-2xl bg-[#1c1c22] border border-[#232329] rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                        <h2 className="text-2xl font-bold text-white mb-2">Momento da Clonagem</h2>
                        <p className="text-[#a1a1aa] mb-8">
                            {method === 'url' ? 'Qual site você quer copiar e importar para a plataforma?' :
                                method === 'code' ? 'Cole o código estrutural abaixo.' :
                                    'Anexe a exportação do arquivo HTML isolado.'}
                        </p>

                        {method === 'url' && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-[#c4c4ce]">Link do concorrente ou referência</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-3.5 w-5 h-5 text-[#71717a]" />
                                    <input
                                        type="url"
                                        placeholder="https://pagina-referencia.com.br"
                                        className="w-full bg-[#0b0b10] border border-[#31313a] rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#8b5cf6] focus:outline-none placeholder:text-[#52525b]"
                                        value={sourceUrl}
                                        onChange={(e) => setSourceUrl(e.target.value)}
                                    />
                                </div>
                                <div className="mt-6 bg-[#16161a] border border-[#232329] p-4 rounded-xl flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse"></div>
                                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                                        Lembre-se: Páginas baseadas no padrão HTML ou Elementor são capturadas com <strong className="text-white">100%</strong> de fidelidade. Estruturas em React/NextJS fechadas podem apresentar distorções pois os componentes são empacotados pelo servidor. Você poderá editar isso tudo logo a seguir na etapa <span className="text-white">Personalizar</span>.
                                    </p>
                                </div>
                            </div>
                        )}

                        {method === 'code' && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-[#c4c4ce]">Código Fonte Original</label>
                                <textarea
                                    placeholder="&lt;html&gt; ... &lt;/html&gt;"
                                    className="w-full h-64 bg-[#0b0b10] border border-[#31313a] rounded-xl p-4 text-[#e4e4e7] focus:border-[#8b5cf6] focus:outline-none font-mono text-xs custom-scrollbar resize-none"
                                    value={sourceCode}
                                    onChange={(e) => setSourceCode(e.target.value)}
                                ></textarea>
                            </div>
                        )}

                        {method === 'file' && (
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-[#31313a] rounded-xl p-12 flex flex-col items-center justify-center hover:border-[#8b5cf6] bg-[#0b0b10] transition-colors relative cursor-pointer">
                                    <Upload className="w-8 h-8 text-[#71717a] mb-4" />
                                    <p className="text-sm text-white font-medium mb-1">{sourceFile ? sourceFile.name : 'Clique para enviar seu .html'}</p>
                                    <p className="text-xs text-[#71717a] text-center">Tamanho máximo ignorado (Apenas HTML estrutural)</p>
                                    <input
                                        type="file"
                                        accept=".html"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setSourceFile(e.target.files[0])
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 4 && (
                    <div className="w-full text-center py-20 animate-pulse">
                        <div className="w-20 h-20 bg-[#2e1065] rounded-full mx-auto flex items-center justify-center mb-8 relative">
                            <Loader2 className="w-10 h-10 text-[#8b5cf6] animate-spin relative z-10" />
                            <div className="absolute inset-0 rounded-full border-4 border-[#8b5cf6] border-t-transparent animate-spin-slow opacity-20"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Hackeando Referência...</h2>
                        <p className="text-[#a1a1aa]">Desmontando tags HTML, capturando CSS e injetando no construtor visual.</p>
                        <p className="text-xs text-[#52525b] mt-4 font-mono">Processando Layout / Montando Blocos ...</p>
                    </div>
                )}


                {/* Global Error Handle */}
                {error && step < 4 && (
                    <div className="mt-6 w-full max-w-2xl bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-center">
                        <p className="text-sm text-red-400 font-medium">{error}</p>
                    </div>
                )}


                {/* Next Steps CTA */}
                {step < 4 && (
                    <div className="mt-8 flex justify-center w-full">
                        <button
                            onClick={handleNextStep}
                            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all active:scale-95"
                        >
                            {step === 3 ? "Replicar Site Agora" : "Continuar"}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}
