"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { ContactNote } from "@/types/crm"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MessageSquare, Trash2 } from "lucide-react"

interface ContactNotesProps {
    contactId: string
}

export function ContactNotes({ contactId }: ContactNotesProps) {
    const [notes, setNotes] = useState<ContactNote[]>([])
    const [loading, setLoading] = useState(true)
    const [newNote, setNewNote] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const supabase = createClient()

    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("contact_notes")
                .select("*")
                .eq("contact_id", contactId)
                .order("created_at", { ascending: false })

            if (error) throw error
            setNotes(data || [])
        } catch (error) {
            console.error("Erro ao buscar notas:", error)
        } finally {
            setLoading(false)
        }
    }, [contactId, supabase])

    useEffect(() => {
        fetchNotes()
    }, [fetchNotes])

    const handleAddNote = async () => {
        if (!newNote.trim()) return

        try {
            setSubmitting(true)
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error("Não autenticado")

            const { error } = await supabase.from("contact_notes").insert({
                contact_id: contactId,
                user_id: user.id,
                content: newNote.trim()
            })

            if (error) throw error

            setNewNote("")
            fetchNotes() // refresh list
        } catch (error) {
            console.error("Erro ao adicionar nota:", error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteNote = async (noteId: string) => {
        if (!confirm("Tem certeza que deseja excluir esta nota?")) return

        try {
            const { error } = await supabase
                .from("contact_notes")
                .delete()
                .eq("id", noteId)

            if (error) throw error
            fetchNotes()
        } catch (error) {
            console.error("Erro ao excluir nota:", error)
        }
    }

    if (loading) {
        return <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
    }

    return (
        <div className="space-y-6">
            {/* Form for new note */}
            <div className="space-y-3">
                <Textarea
                    placeholder="Adicione uma nota sobre este contato..."
                    value={newNote}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
                    className="min-h-[100px] resize-none"
                    disabled={submitting}
                />
                <div className="flex justify-end">
                    <Button onClick={handleAddNote} disabled={!newNote.trim() || submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Nota
                    </Button>
                </div>
            </div>

            {/* List of notes */}
            <div className="space-y-4">
                {notes.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                        Nenhuma nota adicionada ainda.
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="flex gap-4 p-4 border rounded-lg bg-card text-card-foreground">
                            <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit">
                                <MessageSquare className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-start justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {format(new Date(note.created_at), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDeleteNote(note.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        <span className="sr-only">Excluir</span>
                                    </Button>
                                </div>
                                <div className="text-sm prose dark:prose-invert max-w-none">
                                    {note.content.split('\n').map((line, i) => (
                                        <p key={i} className="mb-1">{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
