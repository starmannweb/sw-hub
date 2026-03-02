# Hub - Mapa de Funcionalidades e Arquitetura do Sistema

Este documento descreve detalhadamente o mapeamento de todas as funcionalidades e módulos levantados para a construção do **Hub**, tendo como inspiração os recursos encontrados em sistemas all-in-one de ponta do mercado (como o Triia Hub).

**🔗 Ambiente de Referência:** [Dashboard Triia Hub Explorada](https://sistema.triiahub.com/v2/location/8v8iYw6bE3rA0HNLpD2i/dashboard)

O objetivo é transformar este repositório no guia principal de desenvolvimento para todas as áreas que nossa plataforma deve cobrir.


---

## 1. 📇 CRM de Vendas e Colaboração (Estilo CityCRM)
O coração da equipe comercial. Organiza a captação, o fechamento e a execução do serviço/produto:

- **Leads e Clientes:** Tabela inteligente separando os Leads (Prospecção) dos Clientes Convertidos.
  - **Smart Lists:** Filtros avançados que podem ser salvos.
  - **Ações em Massa:** Adicionar tags, incluir em campanhas, importar/exportar dados.
- **Negócios (Deals - Funis Kanban):** Visualização visual de oportunidades arrastáveis (Pipeline), contendo o valor monetário do negócio e a listagem de estágios customizáveis.
- **Projetos e Tarefas (Pós-Venda):** Inspirado no modelo Colaborativo, logo após o Ganho do "Negócio", inicia-se um "Projeto" com orçamento, datas de entrega e distribuição de tarefas (High/Low Priority) entre a equipe.
- **Propostas e Faturamento:** Emissão de orçamentos e aprovações interligados ao projeto do Cliente.

## 2. 💬 Comunicação e Caixa de Entrada Unificada (Omnichannel)
Centralização da comunicação com o cliente:

- **Unified Inbox:** Uma única tela que consolida mensagens de múltiplos canais:
  - WhatsApp
  - Facebook Messenger
  - Instagram DMs
  - SMS
  - E-mails
- **Recursos Práticos de Atendimento:**
  - **Templates / Snippets:** Respostas rápidas pré-configuradas para dúvidas frequentes.
  - **Links Úteis e Agendamentos:** Envio fácil de links de pagamento e convites para reuniões de dentro do chat.

## 3. 🤖 Automação de Processos (Workflows) e IA
Motor principal para escalar a operação sem aumentar drasticamente os custos:

- **Construtor de Workflows (Canvas Vertical):** Ferramenta visual estilo fluxograma com fluxo de cima para baixo.
  - **Gatilhos Múltiplos (Triggers):** Podem atuar com lógica OR (Ex: Cliente alterou Formulário OU Recebeu uma Tag).
  - **Inserções no Fluxo (+):** Inclusão ágil de passos via interações com menus laterais (Sidebar Options).
- **Gatilhos Chave:** Formulários do Builder enviados, Cards do CRM movidos para Ganhos, Webhooks recebidos, Pagamentos aprovados.
- **Ações:** 
  - **Lógicas:** Condicionais Se/Então (If/Else), Agrupadores, Atraso (Wait/Delays).
  - **Execução:** Envio de E-mails/WhatsApp, Atribuição de Afiliados, Criação de Projetos.
- **Agentes de AI:**
  - Base de Conhecimento (Knowledge Base): Upload de PDFs e textos da empresa para preparar agentes para suporte.

## 4. 🎨 Construtores e Experiência Web (Website Builders)
Ferramentas drag-and-drop prontas para a equipe de marketing:

- **Construtor de Sites e Páginas de Venda:** Editor visual focado em conversão e layout responsivo. Estrutura baseada em blocos.
- **Formulários Dinâmicos e Pesquisas (Quizzes):** Recursos diretos no construtor para coleta de dados e qualificação do cliente em etapas (Multi-step).
- **Mídia Drive:** Gerenciador de arquivos da nuvem para os usuários armazenarem todas as logos, fotos e PDFs usando pastas centralizadas.

## 5. 📅 Agendamentos de Reunião
Substituição nativa de ferramentas terceiras como Calendly:

- **Tipos de Calendários:** Individual para um vendedor, ou com balanceamento (Round-Robin) para distribuir leads entre um time de atendentes.
- **Sincronização:** Integração nativa com Google Calendar e Microsoft Outlook/Teams.
- **Disponibilização de Links:** Compartilhamento através de link único (com tela de bloqueio de horários ocupados) e formulários para qualificar a call.

## 6. 📢 Marketing e Tráfego
Sinergia com fontes de captura e retenção orgânica:

- **Social Planner:** Agendador automático de conteúdos unificado para Instagram, Facebook, LinkedIn, TikTok e Google Meu Negócio.
- **E-mails Marketing (Campanhas):** Editor visual de disparo em massa tipo de newsletter, e medições de leitura/clique.
- **Monitoramento de Anúncios:** Relatórios consumindo as APIs do Google Ads e Meta Ads, para validar o ROI sem sair do Hub.

## 7. 💳 Faturamento e Monetização
Cobrar o cliente sem atritos e de forma ágil:

- **Painel Financeiro:** Emissão de cobranças, faturas recorrentes, orçamentos assináveis digitalmente, e links de pagamentos (Paylinks).
- **Área de Membros (Memberships):** Plataforma de hospedagem para infoprodutos, cursos e treinamentos online da marca ou de clientes.
- **Gestão de Produtos:** Organização em catálogos de vendas.
- Integrações necessárias: Stripe, PayPal, Pagar.me ou MercadoPago (Brasil).

## 8. 🤝 Programa de Parceiros (Indicações/Afiliados)
Um módulo completo de recompensas (Cashback) embutido no sistema CRM, inspirado no controle FBN Indica:

- **Painel do Promotor:** Os afiliados/parceiros possuem seus códigos únicos (ex: `FBN000`) e acessam um painel para visualizar o total de indicados, ranking e solicitar saque do saldo.
- **Automação Lead -> Deal:** Ao usar os Formulários do seu Construtor de Sites por meio de um link de indicação, a plataforma cria a oportunidade de negócio (Deal) no Kanban automaticamente linkado ao parceiro que indicou.
- **Recompensa sem Esforço:** Quando o vendedor arrasta o card do negócio no CRM para a coluna de "Fechado Ganho (Won)", ou o pagamento online for processado, o cashback do parceiro cai na conta.

## 9. ⭐ Gestão de Reputação
Foco na recomendação espontânea:

- Integração total com avaliações do **Google Meu Negócio** e do **Facebook**.
- Envio automatizado de "Pedidos de Avaliação" por WhatsApp / SMS quando a venda é finalizada.
- Resposta a avaliações pela mesma caixa unificada (Unified Inbox).

---

### Status e Prioridades Atuais (MVP)
Para começarmos as implementações no sistema, o foco primário pode estar englobado nos seguintes recursos de acordo com as necessidades mais imediatas do negócio:

- [ ] Melhorias no **CRM de Oportunidades** (Funis Kanban).
- [ ] Construir o robusto **Construtor de Workflows e Automações.**
- [ ] Finalizar e aprimorar as funcionalidades do **Website Builder** (já iniciado com integração do GrapesJS).
- [ ] Refinar as **Páginas de Checkout** e faturamento com métodos eficientes de conversão em tempo real.

> _Documentação criada com base na pesquisa de arquitetura inspirada nos recursos de gestão global de negócios do mercado._
