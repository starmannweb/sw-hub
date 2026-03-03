import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
        }

        // Tentar buscar o HTML original da URL fornecida
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Erro ao buscar URL: Status ${response.status}` }, { status: response.status });
        }

        const html = await response.text();

        // Extrai apenas o body para o GrapesJS e os links de estilos (css)
        // Isso é uma extração simples para MVP (Rápido)
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);

        let extractedBody = bodyMatch ? bodyMatch[1] : html;
        let extractedStyles = '';

        if (headMatch) {
            const headContent = headMatch[1];
            // Extrai as tags <style>
            const styleTags = headContent.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
            extractedStyles += styleTags.join('\n');

            // Extrai os links de CSS
            const linkTags = headContent.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
            // Opcional: Adicionar os links de CSS pode quebrar o CSS do nosso painel, então para MVP focamos no inline ou <style> nativo
            // extractedStyles += linkTags.join('\n');
        }

        return NextResponse.json({
            success: true,
            html: extractedBody,
            css: extractedStyles,
            raw: html // Retornamos o original também para caso precisemos
        });

    } catch (error: any) {
        console.error("Scrape API Error:", error);
        return NextResponse.json({ error: 'Falha ao conectar no site de destino', details: error.message }, { status: 500 });
    }
}
