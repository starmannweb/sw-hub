# 🏗️ Construtor de Sites (Website Builder) - Documentação

Este documento serve como guia rápido para entender e acessar o nosso **Website Builder** interno, construído com GrapesJS e integrado ao Supabase.

## 1. Como Funciona Atualmente?

Nosso construtor de sites é baseado em **Drag-and-Drop** (arrastar e soltar) e utiliza a poderosa biblioteca Open Source **[GrapesJS](https://grapesjs.com/)**. Isso nos permite oferecer uma experiência muito semelhante aos construtores do Triia Hub, Elementor ou Webflow, focada na criação visual de Landing Pages, Funis e Sites completos.

### Tecnologias Envolvidas:
- **Frontend / Editor:** GrapesJS (carregado dinamicamente via Next.js para evitar problemas de SSR - Server Side Rendering).
- **Banco de Dados (Supabase):** Tabela `sites`.
- **Armazenamento de Dados:** 
  - `content` (JSON estrutural do GrapesJS, usado para recarregar o projeto e continuar editando depois).
  - `published_html` (O HTML limpo final gerado após salvar).
  - `published_css` (O CSS final limpo associado à página).

## 2. Como Acessar e Testar

Para abrir e trabalhar no construtor de sites no seu ambiente local (quando precisar visualizar ou focar nele):

### Passo a Passo de Acesso:
1. Inicie o projeto rodando o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Acesse a rota principal de gestão de sites (onde lista todos os seus projetos/funis criados):
   - **URL:** `http://localhost:3000/sites`
   - *Nota:* Se não houver sites, você deverá ter um botão/opção de "Novo Site" nesta tela.
3. Clique em "Editar" (ou no link do site) para acessar o **Construtor Visual**.
   - A URL do editor segue o formato: `http://localhost:3000/sites/[ID_DO_SITE]/editor`
   - Exemplo: `http://localhost:3000/sites/123-abc-456/editor`

## 3. Comparação com a Triia Hub (O que já temos vs O que falta)

Fazendo um paralelo com a ferramenta do *Triia*, aqui está a análise do que já fomos capazes de replicar e os próximos passos sugeridos para que o módulo fique perfeito:

### ✅ O que **Já Temos** (MVP):
- **Painel Drag-and-Drop:** Arrastar blocos (Textos, Imagens, Colunas, Botões) direto na tela.
- **Visualização Responsiva:** Mudar a tela para visualizar a versão de celular ou de computador em tempo real.
- **Carregamento de Templates Dinâmicos:** Possibilidade de injetar HTML externo base no canvas do editor usando o comando `editor.setComponents(templateHtml)`.
- **Salvamento na Nuvem:** O botão de salvar aciona a gravação simultânea no Supabase, permitindo fechar o navegador e voltar ao mesmo ponto depois.

### 🚧 O que **Ainda Falta** para chegar nível Triia:
- **Sistema de Múltiplas Páginas no mesmo Funil:** No Triia, um site tem múltiplos "Steps" (Ex: Página de Captura -> Página de Vendas -> Página de Obrigado). Precisamos mapear isso no banco talvez como uma tabela `site_pages`.
- **Pop-ups e Widgets de Formulário Próprio:** Trazer blocos nativos nossos (Ex: "Formulário de Contato do Hub") e arrastar para dentro da tela, já conectando automaticamente com a tabela de Leads/CRM.
- **A/B Testing de Páginas:** Triplicar uma página para testar qual converte mais ("Split Testing"), clássico de funis.

## 4. Dicas Úteis para Desenvolvimento
- Sempre que for mexer em algum componente do GrapesJS, o arquivo principal de configuração dele (como blocos customizados, plugins, etc) se concentra dentro das pastas em `app/(builder)/sites/[id]/editor/components/`.
- O GrapesJS afeta muito o `window` e a manipulação crua do DOM. Por isso, as importações deles no Next.js App Router DEVEM continuar como `dynamic` configuradas com `{ ssr: false }`. Evite mudar isso, ou o Next.js vai retornar fortes erros de hidratação (Hydration Error).
