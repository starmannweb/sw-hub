import { GraduationCap } from "lucide-react"

export default function TreinamentosPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Treinamentos</h1>
                    <p className="text-sm text-gray-500">Cursos e materiais de apoio para sua equipe</p>
                </div>
            </div>

            <div className="rounded-xl bg-[#1e1e1e] border border-white/5 p-12 text-center">
                <GraduationCap className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Em breve</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                    O módulo de treinamentos está sendo preparado. Aqui você poderá acessar cursos, tutoriais e materiais para capacitar sua equipe.
                </p>
            </div>
        </div>
    )
}
