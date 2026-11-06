# Separação das Interfaces Nexus: Painel Administrativo (/admin) & Frente de Caixa (/pdv)

Reorganização completa do frontend da aplicação Nexus PDV & ERP para desacoplar a experiência de gestão gerencial (Admin) da operação diária de caixa (PDV), garantindo operação focada, livre de distrações e protegida por autenticação gerencial.

---

## Decisões Confirmadas com o Usuário

> [!IMPORTANT]
> As seguintes escolhas de arquitetura e navegação foram alinhadas e confirmadas:
> 
> 1. **Tela Padrão da Aplicação**: Acesso inicial à raiz (`/`) direciona por padrão para o **Painel Administrativo (`/admin`)**.
> 2. **Segurança de Saída do PDV**: O operador no caixa não tem acesso ao menu administrativo; ao solicitar retorno ou abertura do `/admin`, é exigida a **validação da senha da gerente** via modal de liberação gerencial.
> 3. **Roteamento**: **Roteamento SPA nativo** no navegador, manipulando rotas `/admin` e `/pdv` com sincronização transparente via `History API` (`pushState` / `popstate`) e atalhos de teclado (F2 para PDV).
> 4. **Preservação Absoluta do Backend**: Nenhuma entidade, serviço ou lógica de negócio será alterada ou duplicada; `StorageService`, regras fiscais e backend Java existente permanecem íntegros.

---

## 1. Visão Geral & Conceito do Produto

O **Nexus PDV & ERP** passa a operar com duas frentes visualmente especializadas conectadas à mesma fonte de verdade:

1. **Painel Administrativo (`/admin`)**:
   - **Público**: Proprietários, Diretores, Gerentes e Estoquistas.
   - **Objetivo**: Gestão estratégica, cadastros de produtos, controle de estoque com alertas de ponto de reposição, cadastro de clientes/fornecedores, relatórios de DRE e fluxo financeiro, auditoria fiscal, gestão de usuários e console do backend Java.
   - **Estrutura**: Mantém barra superior unificada e menu lateral retrátil com navegação categorizada.

2. **Frente de Caixa — PDV (`/pdv`)**:
   - **Público**: Operadores de caixa e atendentes de balcão.
   - **Objetivo**: Máxima velocidade no atendimento ao cliente, registro de itens por código de barras em milissegundos, tela limpa sem menus laterais ou distrações visuais, suporte a touch screen e atalhos de teclado (F1 a F12).
   - **Segurança**: Barra superior dedicada de PDV contendo apenas identificação do terminal, status do turno/caixa, operador logado, botões de Sangria/Suprimento/Fechamento e botão protegido "Acessar Painel Gerencial (Exige Senha)".

---

## 2. Experiência do Usuário & Design Visual

### A. Frente de Caixa Exclusiva (`/pdv`)
- **Imersão Total**: Viewport 100% preenchido, sem barra lateral administrativa à esquerda.
- **Header Operacional de Alta Eficiência**:
  - Logo e badge do Terminal (`Terminal #1 - PDV Ativo`).
  - Status do Caixa (`Aberto` com indicador verde pulsante ou `Fechado` com aviso amarelo).
  - Operador atual em turno.
  - Ações rápidas de caixa: `Abertura / Fechamento de Caixa` e `Sangria / Suprimento`.
  - Botão de saída segura com cadeado: `Painel Admin` (aciona modal gerencial solicitando seleção do gerente e senha `1234`).
- **Workspace Principal de Venda**:
  - Coluna esquerda: Leitor contínuo de código de barras, busca rápida de catálogo por categoria, grid de produtos favoritos com toques grandes.
  - Coluna direita: Cupom fiscal eletrônico na tela com itens tabulados, cálculo automático de subtotal, descontos, totalizador de grande contraste (`tabular-nums`), atalhos de teclado visíveis (F1 Ajuda, F2 Buscar, F3 Desconto, F4 Finalizar, F9 Sangria, F10 Fechar Caixa).
- **Modais de Finalização**:
  - Modal de Pagamentos com seleção múltipla (Dinheiro com cálculo dinâmico de troco, Cartão Débito/Crédito TEF, PIX com QR Code dinâmico).
  - Modal de Impressão Térmica de Cupom Não Fiscal / NFC-e.

### B. Painel Administrativo (`/admin`)
- **Layout Corporativo**: Sidebar lateral esquerda com todos os 10 módulos administrativos (Dashboard, Produtos, Estoque, Clientes, Financeiro, Fiscal, TEF, Caixa/Turnos, Usuários e Backend Java Swagger).
- **Botão de Acesso ao Caixa**: Destaque visual no topo da sidebar e navbar para abrir a Frente de Caixa (`/pdv`), permitindo que a gerência transite para a operação de vendas a qualquer momento.

### C. Paleta e Tipografia
- **Tema Base**: Dark mode profissional (`bg-slate-950`, superfícies `bg-slate-900`, bordas `border-slate-800`).
- **Acentos**: Esmeralda para caixa e valores positivos (`text-emerald-400`, `bg-emerald-500/20`), Azul para produtos (`text-blue-400`), Âmbar para estoque (`text-amber-400`) e Carmesim para sangrias e avisos (`text-rose-400`).
- **Numerais**: Todos os campos monetários formatados em `font-mono tabular-nums` para alinhamento contábil estrito.

---

## 3. Decisões Arquiteturais & Trade-Offs

- **Router Baseado em URL SPA sem dependência externa pesada**:
  - *Abordagem*: Gerenciamento de rotas `/admin` e `/pdv` via componente `AppRouter` integrado que observa `window.location.pathname`, dispara sincronização com `history.pushState` e escuta eventos de `popstate`.
  - *Vantagem*: URLs limpas para o usuário (`/pdv`, `/admin`), bookmarking nativo no navegador, sem quebrar builds ou adicionar pacotes conflitantes no Vite.
- **Autenticação Gerencial Centralizada para Saída do PDV**:
  - *Abordagem*: Modal reutilizável `ManagerAuthModal` que valida o cargo (Gerente ou Administrador) e a senha cadastrada antes de redirecionar para `/admin`.
  - *Vantagem*: Atende 100% ao requisito de impedir que o operador de caixa mexa nas configurações da loja ou visualize relatórios financeiros sem autorização.
- **Layouts Desacoplados**:
  - `AdminLayout`: Envolve `Navbar`, `Sidebar` e o conteúdo das abas administrativas.
  - `PdvLayout`: Envolve `PdvHeader` (compacto e focado) e o `PdvScreen` em tela cheia.

---

## 4. Arquitetura Técnica & Fluxo de Componentes

```
                   ┌───────────────────────────────────────┐
                   │               App.tsx                 │
                   │        (Roteador SPA / Estado)        │
                   └──────────────────┬────────────────────┘
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
 ┌───────────────────────┐                           ┌───────────────────────┐
 │      Rota: /admin     │                           │      Rota: /pdv       │
 │      (AdminLayout)    │                           │      (PdvLayout)      │
 ├───────────────────────┤                           ├───────────────────────┤
 │ • Navbar Superior     │                           │ • PdvHeader dedicado  │
 │ • Sidebar Completa    │                           │   - Terminal & Status │
 │   - Dashboard         │                           │   - Operador Ativo    │
 │   - Produtos          │                           │   - Sangria/Caixa     │
 │   - Estoque           │                           │   - Botão "Painel"    │
 │   - Clientes          │                           │     (Exige Senha)     │
 │   - Financeiro        │                           │                       │
 │   - Fiscal & TEF      │                           │ • PdvScreen (Full)    │
 │   - Usuários          │                           │   - Scanner Código    │
 │   - Backend Java      │                           │   - Carrinho & Troco  │
 │ • Botão "Ir para PDV" │                           │   - Modal Pagamento   │
 └──────────┬────────────┘                           └───────────┬───────────┘
            │                                                    │
            │               ┌────────────────────┐               │
            └──────────────>│ ManagerAuthModal   │<──────────────┘
                            │ (Valida Gerente)   │
                            └─────────┬──────────┘
                                      ▼
                        ┌───────────────────────────┐
                        │      StorageService       │
                        │ (Produtos, Vendas, Caixa) │
                        └───────────────────────────┘
```

---

## 5. Plano de Execução em Fases

1. **Criação do Modal de Autenticação Gerencial (`ManagerAuthModal.tsx`)**:
   - Componente seguro para validação de senha gerencial (`1234` ou personalizada dos usuários cadastrados) com feedback visual claro.
2. **Construção do Cabeçalho Exclusivo do PDV (`PdvHeader.tsx`)**:
   - Barra superior otimizada com relógio, terminal, status do caixa, botões de ação operacional e botão com cadeado para o Admin.
3. **Criação dos Layouts Dedicados**:
   - `PdvLayout.tsx`: Renderiza `PdvHeader`, modal de sangria/caixa e `PdvScreen` ocupando 100% da viewport.
   - `AdminLayout.tsx`: Renderiza a `Navbar` administrativa, `Sidebar` com as telas gerenciais e atalho para a Frente de Caixa.
4. **Atualização do `App.tsx` com Roteador SPA**:
   - Manipulação de rotas `/admin` e `/pdv` com fallback automático de `/` para `/admin`.
   - Interceptação de navegação entre PDV e Admin com proteção gerencial.
5. **Verificação de Compilação & Integridade**:
   - Execução simultânea de `compile_applet` e `lint_applet` para assegurar que não haja quebras de tipos ou referências.
