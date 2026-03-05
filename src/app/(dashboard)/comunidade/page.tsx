import { MessageCircle, ExternalLink } from "lucide-react"

export default function ComunidadePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Comunidade</h1>
                    <p className="text-sm text-gray-500">Conecte-se com outros membros da comunidade</p>
                </div>
            </div>

            <div className="rounded-xl bg-[#1e1e1e] border border-white/5 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 mb-4">
                    <MessageCircle className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Acesse a Comunidade</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Participe do nosso servidor no Discord para trocar ideias, tirar dúvidas e fazer networking com outros membros.
                </p>
                <a
                    href="https://discord.gg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                >
                    Entrar no Discord
                    <ExternalLink className="h-4 w-4" />
                </a>
            </div>
        </div>
    )
}
