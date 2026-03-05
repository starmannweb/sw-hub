# SWHub — Roadmap Estratégico

> Documento vivo. Atualizar conforme decisões forem tomadas.

---

## 1. SISTEMA DE INDICAÇÕES (Parceiros)

### Conceito
- **Usuário ADM** (você): **recebe** indicações de leads vindos dos parceiros.
- **Usuário comum** (parceiro/afiliado): **envia** indicações de clientes via link pessoal ou cadastro manual.

### Fluxo
```
Parceiro compartilha link → Lead se cadastra → Lead entra no CRM do ADM
                                              → Parceiro vê status no painel dele
                                              → Quando deal fecha → comissão/cashback é creditado
```

### O que precisa ser feito

| Tarefa | Prioridade | Dependência externa |
|--------|-----------|---------------------|
| Tela de parceiro: link de indicação, histórico, carteira de cashback | Alta | — |
| Tela ADM: ver todas indicações recebidas, aprovar/rejeitar | Alta | — |
| Página de captura pública (`/site-captura?ref=CODIGO`) | Alta | — |
| Webhook/trigger: lead cadastrado via indicação → entra no CRM com tag `indicação` + `ref` do parceiro | Alta | — |
| Lógica de comissão: % ou valor fixo por deal fechado | Média | Decisão de negócio |
| Saque de cashback (Pix): solicitação + aprovação ADM | Média | Gateway Pix (ex: Mercado Pago, Asaas, Stripe) |
| Proteção de lead: prazo de validade da indicação (ex: 90 dias) | Média | — |

---

## 2. MODELO DE MONETIZAÇÃO — Planos vs Créditos

### Opção A: Planos fixos (recorrência)
```
Gratuito       → funcionalidades básicas (CRM limitado, 1 site)
Profissional   → CRM completo, 5 sites, automações, indicações
Empresarial    → ilimitado, API, white-label, suporte prioritário
```

### Opção B: Créditos (pay-as-you-go)
```
1 crédito = 1 ação (enviar proposta, publicar site, rodar automação)
Pacotes: 100 créditos R$49 / 500 créditos R$199 / 2000 créditos R$599
```

### Opção C: Híbrido (recomendado)
```
Plano base (recorrência)  → desbloqueia funcionalidades + inclui X créditos/mês
Créditos extras           → compra avulsa para quem exceder o limite
```

**Vantagem do híbrido:** receita previsível (plano) + upsell natural (créditos).

### O que precisa ser feito

| Tarefa | Prioridade | Dependência externa |
|--------|-----------|---------------------|
| Definir quais funcionalidades cada plano libera | Alta | Decisão de negócio |
| Definir quais ações consomem créditos e quantos | Alta | Decisão de negócio |
| Tabela `plans` e `user_credits` no Supabase | Alta | — |
| Middleware de verificação de plano/crédito por rota | Alta | — |
| Tela de planos e upgrade (com checkout) | Alta | Gateway de pagamento (Stripe, Asaas) |
| Tela de consumo de créditos (histórico) | Média | — |
| Webhook de pagamento → ativar plano/créditos | Alta | Gateway de pagamento |

---

## 3. FOLLOW-UP — Motor de Rotina Comercial

### Princípio
> "Nenhum lead fica sem próxima ação."

### Arquitetura

```
[Gatilho] → [Régua selecionada] → [Fila de mensagens agendadas] → [Envio] → [Log]
                                                                     ↑
                                                              Pode pausar/editar
```

### Gatilhos mínimos (estados do lead/deal)

| Gatilho | Descrição |
|---------|-----------|
| `lead_created_no_reply` | Lead criado e não respondeu |
| `seller_sent_no_reply` | Vendedor mandou msg, cliente em silêncio |
| `proposal_sent` | Proposta enviada |
| `deal_won` | Deal ganho (onboarding) |
| `deal_lost` | Deal perdido (reativação opcional) |

### 4 Réguas prontas (já vendáveis)

**1) Régua "Lead Frio"** (não respondeu)
- D+1: mensagem curta
- D+3: mensagem com pergunta objetiva
- D+7: última tentativa elegante (encerra o loop)

**2) Régua "Pós-Proposta"**
- D+1: "Viu a proposta?"
- D+3: "Posso ajustar algo?"
- D+5: "Fechamos ou arquivamos?"

**3) Régua "Onboarding"** (pós-fechamento)
- D+0: boas-vindas + próximos passos
- D+2: checklist
- D+7: primeira revisão

**4) Régua "Reativação"** (30/60/90)
- Mensagem de retomada com novidade/gancho

### UI no CRM

Na tela do lead/conversa:
```
┌─────────────────────────────────────────────┐
│ Régua ativa: Lead Frio (etapa 2/3)          │
│ Próximo envio: amanhã 10:00                 │
│                                             │
│ [Pausar régua]  [Enviar agora]              │
│ [✏️ Editar mensagem antes de enviar]         │
└─────────────────────────────────────────────┘
```

No Kanban do CRM:
- Coluna extra: **Próxima ação** + **Data**

### O que precisa ser feito

| Tarefa | Prioridade | Dependência externa |
|--------|-----------|---------------------|
| Tabelas: `follow_up_rules`, `follow_up_sequences`, `follow_up_queue`, `follow_up_logs` | Alta | — |
| Editor de réguas (CRUD) com templates prontos | Alta | — |
| Engine de agendamento (cron job / Supabase Edge Function / Vercel Cron) | Alta | Vercel Cron ou serviço de fila |
| UI de régua ativa na tela do lead | Alta | — |
| Colunas "Próxima ação" e "Data" no Kanban | Média | — |
| Pausar / retomar / pular etapa | Média | — |
| Log de auditoria (quem mandou, quando, status) | Média | — |
| Personalização de mensagem com variáveis (`{{nome}}`, `{{empresa}}`) | Média | — |

---

## 4. INTEGRAÇÃO WHATSAPP

### Abordagem recomendada: Extensão Chrome + API

**Fase 1 — Extensão Chrome (MVP rápido)**
- Extensão detecta conversa aberta no WhatsApp Web
- Botão "Salvar no SWHub" → captura nome + telefone + última msg
- Envia para API do SWHub → cria lead no CRM em 1 clique
- Tecnologia: Chrome Extension (Manifest V3) + API Next.js

**Fase 2 — WhatsApp Business API (escala)**
- Envio de mensagens de follow-up diretamente pelo SWHub
- Templates aprovados pelo Meta
- Recebimento de respostas no CRM
- Tecnologia: API oficial do WhatsApp Business (via provedor: Twilio, Z-API, Evolution API)

### O que precisa ser feito

| Tarefa | Prioridade | Dependência externa |
|--------|-----------|---------------------|
| Extensão Chrome: captura de contato do WhatsApp Web | Alta | Chrome Web Store (publicação) |
| API endpoint: `POST /api/leads/from-whatsapp` | Alta | — |
| Fase 2: escolher provedor WhatsApp Business API | Média | Z-API / Evolution API / Twilio |
| Fase 2: envio de follow-up via WhatsApp | Média | Provedor escolhido |
| Fase 2: recebimento de respostas (webhook) | Baixa | Provedor escolhido |

---

## 5. DOMÍNIO PERSONALIZADO (Construtor de Sites)

### Fluxo pós-publicação
```
Usuário publica página → Página fica em swhub.com/s/slug
                        → Usuário quer domínio próprio
                        → Tela: "Conectar domínio"
                        → Instruções de DNS (CNAME)
                        → SWHub valida o DNS
                        → Certificado SSL automático
                        → Página servida no domínio do cliente
```

### O que precisa ser feito

| Tarefa | Prioridade | Dependência externa |
|--------|-----------|---------------------|
| Tela "Conectar domínio" com instruções de CNAME | Média | — |
| API de validação de DNS (`dig` ou lib DNS) | Média | — |
| Configuração de wildcard SSL (Let's Encrypt / Vercel) | Média | Vercel (domínios custom) ou Cloudflare |
| Proxy reverso para servir página no domínio custom | Média | Vercel / Cloudflare Workers |
| Registro de domínio na tabela `site_domains` | Média | — |

**Nota:** Se hospedado na Vercel, pode-se usar a [Vercel Domains API](https://vercel.com/docs/rest-api/endpoints#domains) para automatizar a adição de domínios custom.

---

## 6. CONSULTORIAS

### Conceito
Oferecer consultorias como serviço dentro do Hub, com agendamento e acompanhamento.

### Fluxo sugerido
```
Cliente agenda consultoria → Notificação para ADM
                            → Reunião acontece
                            → ADM registra notas/ações
                            → Follow-up automático pós-consultoria
                            → Crédito consumido ou cobrado à parte
```

### O que precisa ser feito

| Tarefa | Prioridade | Dependência externa |
|--------|-----------|---------------------|
| Página de agendamento (calendário) | Média | API de calendário (Cal.com, Calendly, ou custom) |
| Tabela `consultations` (data, cliente, notas, status) | Média | — |
| Integração com Google Meet / Zoom (link automático) | Baixa | API do Google/Zoom |
| Régua de follow-up pós-consultoria | Baixa | Sistema de follow-up (item 3) |

---

## 7. NOTIFICAÇÕES

### Tipos de notificação

| Evento | Canal |
|--------|-------|
| Novo lead via indicação | In-app + e-mail |
| Follow-up agendado | In-app |
| Proposta visualizada | In-app |
| Deal mudou de estágio | In-app |
| Pagamento recebido | In-app + e-mail |
| Créditos acabando | In-app + e-mail |
| Novo ticket de suporte | In-app + e-mail |

### O que precisa ser feito

| Tarefa | Prioridade | Dependência externa |
|--------|-----------|---------------------|
| Tabela `notifications` (user_id, type, title, body, read, created_at) | Alta | — |
| API: `GET /api/notifications`, `PATCH /api/notifications/:id/read` | Alta | — |
| Componente de sino (bell) com badge de contagem | Alta | — |
| Dropdown de notificações no header | Alta | — |
| Real-time via Supabase Realtime (push instantâneo) | Média | Supabase Realtime |
| E-mail transacional (Resend, SendGrid) | Média | Resend / SendGrid |

---

## 8. TEMA DARK / LIGHT

### Status atual
- Dark theme está como padrão
- Toggle existe no header (ThemeToggle component)
- CSS variables já estão configuradas para ambos os temas

### Problema
- Sidebar e backgrounds usam cores hardcoded (`bg-[#1a1a1a]`, `bg-[#111]`)
- Precisam ser migrados para CSS variables para funcionar com light mode

### O que precisa ser feito

| Tarefa | Prioridade | Dependência externa |
|--------|-----------|---------------------|
| Substituir cores hardcoded por CSS variables (sidebar, header, main, cards) | Média | — |
| Testar visual do light mode em todas as páginas | Média | — |
| Persistir preferência do usuário (localStorage ou Supabase) | Baixa | — |

---

## 9. AUTOMAÇÕES + AGENTES DE IA (futuro)

### Conceito
- Automações visuais (tipo Zapier/n8n) para conectar eventos do CRM
- Agentes de IA para responder leads, qualificar, agendar reuniões

### O que precisa ser feito

| Tarefa | Prioridade | Dependência externa |
|--------|-----------|---------------------|
| Editor visual de fluxos (drag & drop) | Baixa | Lib de fluxos (ReactFlow) |
| Triggers: novo lead, deal mudou, proposta aberta | Baixa | — |
| Actions: enviar msg, mover deal, criar tarefa, notificar | Baixa | — |
| Integração com OpenAI / Anthropic para agentes | Baixa | API key do provedor |
| Agente de qualificação de leads (chatbot) | Baixa | LLM API |

---

## ORDEM DE EXECUÇÃO SUGERIDA

### Fase 1 — MVP Comercial (4-6 semanas)
1. ✅ Sidebar e dashboard reorganizados
2. Notificações in-app (tabela + bell + dropdown)
3. Follow-up engine (réguas + agendamento + UI no lead)
4. Extensão Chrome WhatsApp (salvar lead em 1 clique)
5. Tema dark/light funcionando 100%

### Fase 2 — Monetização (2-4 semanas)
6. Definir planos e créditos
7. Gateway de pagamento (Stripe ou Asaas)
8. Tela de planos + checkout + webhook

### Fase 3 — Escala (4-8 semanas)
9. Sistema de indicações completo (parceiro + cashback)
10. Domínio personalizado para sites
11. Consultorias com agendamento
12. WhatsApp Business API (envio de follow-up)

### Fase 4 — Diferencial (ongoing)
13. Automações visuais
14. Agentes de IA
15. API pública para integrações

---

## FERRAMENTAS EXTERNAS NECESSÁRIAS

| Ferramenta | Para quê | Quando |
|-----------|---------|--------|
| **Resend** ou **SendGrid** | E-mail transacional (notificações, follow-up) | Fase 1 |
| **Vercel Cron** ou **Supabase Edge Functions** | Agendamento de follow-ups | Fase 1 |
| **Chrome Web Store** | Publicar extensão WhatsApp | Fase 1 |
| **Stripe** ou **Asaas** | Pagamentos (planos + créditos + cashback) | Fase 2 |
| **Z-API** ou **Evolution API** | WhatsApp Business API | Fase 3 |
| **Cal.com** ou custom | Agendamento de consultorias | Fase 3 |
| **Cloudflare** ou **Vercel Domains API** | Domínios custom para sites | Fase 3 |
| **ReactFlow** | Editor visual de automações | Fase 4 |
| **OpenAI / Anthropic API** | Agentes de IA | Fase 4 |
