"use client"

import React, { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
// @ts-ignore
import grapesJSPresetWebpage from 'grapesjs-preset-webpage';
import { Topbar } from './custom-builder/topbar';
import { LeftSidebar } from './custom-builder/left-sidebar';
import { RightSidebar } from './custom-builder/right-sidebar';

interface BuilderProps {
    initialData: any;
    siteId?: string;
    onSave: (data: any, html: string, css: string) => void;
}

export default function Builder({ initialData, siteId, onSave }: BuilderProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editorInstanceRef = useRef<Editor | null>(null);
    const pendingHtmlRef = useRef<string | null>(null);
    const templateKeyRef = useRef<string | null>(null);
    const [editor, setEditor] = useState<Editor | null>(null);

    // UI state for our custom panels
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

    useEffect(() => {
        if (!editorRef.current) return;

        // ── Read pending template from localStorage BEFORE init ──
        let pendingHtml: string | null = null;

        if (siteId) {
            const templateKey = `site_template_${siteId}`;
            const stored = localStorage.getItem(templateKey);
            if (stored && !initialData?.pages) {
                try {
                    const templateInfo = JSON.parse(stored);
                    console.log("📦 Template detectado:", templateInfo.templateName, `(${templateInfo.category})`);

                    const tName = templateInfo.templateName || "Meu Site";
                    const tCat = templateInfo.category || "";

                    pendingHtml = [
                        '<section style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;text-align:center;padding:60px 20px;">',
                        '<h1 style="font-size:3rem;font-weight:800;margin-bottom:16px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">' + tName + '</h1>',
                        '<p style="font-size:1.25rem;max-width:600px;opacity:0.9;margin-bottom:32px;">Modelo baseado na categoria: ' + tCat + '</p>',
                        '<a href="#" style="display:inline-block;padding:16px 40px;background:white;color:#667eea;font-weight:700;border-radius:12px;text-decoration:none;font-size:1.1rem;box-shadow:0 4px 15px rgba(0,0,0,0.2);">Saiba Mais</a>',
                        '</section>',
                        '<section style="padding:80px 40px;background:white;text-align:center;">',
                        '<h2 style="font-size:2rem;font-weight:700;color:#1a1a2e;margin-bottom:16px;">Nossos Serviços</h2>',
                        '<p style="font-size:1rem;color:#666;max-width:700px;margin:0 auto 48px;">Personalize esta seção com os serviços que sua empresa oferece.</p>',
                        '<div style="display:flex;gap:32px;max-width:1000px;margin:0 auto;justify-content:center;flex-wrap:wrap;">',
                        '<div style="padding:32px;background:#f8f9fa;border-radius:16px;text-align:center;flex:1;min-width:250px;">',
                        '<div style="font-size:2.5rem;margin-bottom:16px;">🎯</div>',
                        '<h3 style="font-size:1.25rem;font-weight:600;color:#1a1a2e;margin-bottom:8px;">Serviço 1</h3>',
                        '<p style="color:#666;font-size:0.9rem;">Descrição do serviço aqui</p>',
                        '</div>',
                        '<div style="padding:32px;background:#f8f9fa;border-radius:16px;text-align:center;flex:1;min-width:250px;">',
                        '<div style="font-size:2.5rem;margin-bottom:16px;">⚡</div>',
                        '<h3 style="font-size:1.25rem;font-weight:600;color:#1a1a2e;margin-bottom:8px;">Serviço 2</h3>',
                        '<p style="color:#666;font-size:0.9rem;">Descrição do serviço aqui</p>',
                        '</div>',
                        '<div style="padding:32px;background:#f8f9fa;border-radius:16px;text-align:center;flex:1;min-width:250px;">',
                        '<div style="font-size:2.5rem;margin-bottom:16px;">🏆</div>',
                        '<h3 style="font-size:1.25rem;font-weight:600;color:#1a1a2e;margin-bottom:8px;">Serviço 3</h3>',
                        '<p style="color:#666;font-size:0.9rem;">Descrição do serviço aqui</p>',
                        '</div>',
                        '</div>',
                        '</section>',
                        '<section style="padding:60px 40px;background:#1a1a2e;text-align:center;color:white;">',
                        '<h2 style="font-size:2rem;font-weight:700;margin-bottom:16px;">Entre em Contato</h2>',
                        '<p style="font-size:1rem;opacity:0.8;max-width:500px;margin:0 auto 32px;">Ficou interessado? Fale conosco agora mesmo.</p>',
                        '<a href="#" style="display:inline-block;padding:14px 36px;background:#667eea;color:white;font-weight:700;border-radius:12px;text-decoration:none;font-size:1rem;">Fale Conosco</a>',
                        '</section>',
                    ].join('\n');

                    // Store in ref so it survives React StrictMode remounts
                    pendingHtmlRef.current = pendingHtml;
                    templateKeyRef.current = templateKey;
                    // DON'T remove from localStorage yet - wait for successful injection
                } catch (err) {
                    console.error("Erro ao ler template do localStorage:", err);
                }
            }
        }

        // Initialize GrapesJS
        const e = grapesjs.init({
            container: editorRef.current,
            height: 'calc(100vh - 56px)',
            width: 'auto',
            storageManager: false,
            plugins: [grapesJSPresetWebpage],
            pluginsOpts: {
                [grapesJSPresetWebpage as any]: {
                    blocksBasicOpts: { flexGrid: true },
                    formsOpts: true,
                    navbarOpts: true,
                    countdownOpts: true,
                    exportOpts: true,
                }
            },
            panels: { defaults: [] },
            projectData: initialData || {},
            fromElement: true,
        });

        // Store in ref so callbacks can safely reference it
        editorInstanceRef.current = e;
        setEditor(e);

        // If there's a pending template, inject it after the editor is ready
        if (pendingHtml || pendingHtmlRef.current) {
            const doInject = () => {
                // CRITICAL: Check if THIS editor instance is still alive
                const currentEditor = editorInstanceRef.current;
                if (!currentEditor || currentEditor !== e) {
                    console.log("⚠️ Editor instance changed, skipping injection");
                    return;
                }

                // Read from ref (survives StrictMode remount)
                const htmlToInject = pendingHtmlRef.current;
                if (!htmlToInject) {
                    console.log("⚠️ No pending HTML to inject");
                    return;
                }

                console.log("✅ Injetando template no editor...");
                let success = false;

                try {
                    if (typeof currentEditor.setComponents === 'function') {
                        currentEditor.setComponents(htmlToInject);
                        console.log("✅ Template injetado via setComponents!");
                        success = true;
                    }
                } catch (err1) {
                    console.error("setComponents falhou:", err1);
                }

                if (!success) {
                    try {
                        if (typeof currentEditor.addComponents === 'function') {
                            currentEditor.addComponents(htmlToInject);
                            console.log("✅ Template injetado via addComponents!");
                            success = true;
                        }
                    } catch (err2) {
                        console.error("addComponents falhou:", err2);
                    }
                }

                if (!success) {
                    try {
                        const wrapper = currentEditor.getWrapper?.();
                        if (wrapper) {
                            wrapper.components(htmlToInject);
                            console.log("✅ Template injetado via wrapper!");
                            success = true;
                        }
                    } catch (err3) {
                        console.error("wrapper.components falhou:", err3);
                    }
                }

                if (success) {
                    // Only clean up AFTER successful injection
                    pendingHtmlRef.current = null;
                    if (templateKeyRef.current) {
                        localStorage.removeItem(templateKeyRef.current);
                        templateKeyRef.current = null;
                    }
                } else {
                    console.error("❌ Todas as tentativas de injeção falharam");
                }
            };

            // Inject after a delay to ensure the editor is fully mounted
            const timerId = setTimeout(doInject, 1000);

            // Also try on load event
            e.on('load', () => {
                clearTimeout(timerId);
                doInject();
            });
        }

        return () => {
            editorInstanceRef.current = null;
            if (e) {
                e.destroy();
            }
        };
    }, []);

    return (
        <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
            {/* Our custom React Topbar */}
            <Topbar onImportJsonClick={() => fileInputRef.current?.click()} />

            <div className="flex-1 relative flex">
                {/* Our custom React Left Sidebar */}
                <LeftSidebar
                    editor={editor}
                />

                {/* GrapesJS Canvas Area */}
                <div className="flex-1 relative h-full">
                    {/* CSS to ensure GrapesJS canvas fits our design */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .gjs-cv-canvas {
                            top: 0 !important;
                            width: 100% !important;
                            height: 100% !important;
                            background-color: #f3f4f6;
                        }
                        /* Hide default panels and sidebars from GrapesJS */
                        .gjs-pn-panel {
                            display: none !important;
                        }
                        .gjs-pn-views-container {
                            display: none !important;
                        }
                        .gjs-editor-cont {
                            background-color: transparent !important;
                        }
                        /* Emulate device responsive wrapper */
                        .gjs-frame {
                            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                        }
                    `}} />

                    <div ref={editorRef} className="h-full w-full" />
                </div>

                {/* Our custom React Right Sidebar */}
                <RightSidebar
                    editor={editor}
                    isOpen={rightSidebarOpen}
                    onClose={() => setRightSidebarOpen(false)}
                />
            </div>

            {/* Hidden input for importing JSON models */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={(ev) => {
                    const file = ev.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            try {
                                const json = JSON.parse(event.target?.result as string);
                                editor?.loadProjectData(json);
                                alert('Modelo importado com sucesso!');
                            } catch (err) {
                                console.error("Erro ao importar JSON", err);
                                alert('Erro ao importar JSON. O arquivo é válido?');
                            }
                        };
                        reader.readAsText(file);
                    }
                }}
            />
        </div>
    );
}
