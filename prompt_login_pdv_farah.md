# Prompt Mestre de Engenharia: Implementação da Tela de Login e Integração de Autenticação no Farah PDV & ERP

> **Instruções para a IA executora:**  
> Você é um engenheiro de software sênior encarregado de implementar e integrar a **Tela de Autenticação / Login** no ecossistema do **Farah PDV & ERP (Farah Esfiharia e Pizzaria)**.  
> Siga rigorosamente as diretrizes abaixo, respeitando a arquitetura existente do projeto, os tokens de design da marca Farah e garantindo segurança, fluidez operacional e ausência de regressões.

---

## 1. Diagnóstico e Alinhamento Arquitetural do Repositório

Antes de escrever qualquer código, considere o estado real do projeto:
- **Frontend Atual:** Single Page Application (SPA) construída com **React 19**, **Vite 8**, **Tailwind CSS v4** (`@import "tailwindcss";`), **Lucide React** e **TypeScript**.
- **Backend / Persistência Atual:** 
  1. No client-side: camada centralizada em `src/services/storage.ts` (`StorageService`) gerenciando usuários, permissões, caixas, vendas e auditoria via `localStorage` com schema versionado.
  2. No repositório: backend pronto em **Java Spring Boot 3.4 com PostgreSQL** em `/backend-java`, documentado e pronto para endpoints REST (`/api/auth/login`, `/api/products`, `/api/sales`).
  3. *Nota de Compatibilidade:* Caso o projeto venha a ser plugado ao Supabase Auth ou Spring Boot Security, a camada de autenticação deve ser modular (criando um adaptador limpo em `src/services/auth.ts`), sem acoplamento rígido que quebre o funcionamento atual em runtime.
- **Identidade Visual Oficial Farah:**
  - Amarelo Ouro: `#FFCC33` (contrastado obrigatoriamente com texto carvão `#242424`).
  - Vermelho Especiaria: `#CF1020` (ações primárias, botões de entrar/checkout com texto branco).
  - Carvão Estrutural: `#242424` (títulos, cabeçalhos, barras de comando).
  - Fundo Neutro: `#F6F5F1` (off-white acolhedor para as telas).
  - Superfícies: `#FFFFFF` (cards, modais e containers).
  - Semáforos: Sucesso `#26734D`, Alerta `#D97706`, Erro `#B42318`.

---

## 2. Requisitos da Tela de Autenticação (`/login` e Modais)

Crie uma experiência de autenticação de duplo perfil para atender às duas realidades de uma esfiharia:

### A. Modo Operador de Frente de Caixa (PIN Pad Touch Rápido)
- **Cenário:** Na rotina de alta demanda do balcão e delivery, operadores trocam de turno ou desbloqueiam o terminal sem tempo para digitar e-mails longos.
- **Interface:**
  - Grade ou carrossel de seleção rápida de operadores cadastrados (com nome, papel e badge de status).
  - Teclado numérico virtual touch grande (botões 0-9, Limpar, Voltar, Confirmar) otimizado para telas touch ou leitor de crachá/código.
  - Campo de PIN mascarado de 4 a 6 dígitos com feedback tátil/visual.
  - Atalho de teclado físico numérico mapeado (Numpad, Backspace, Enter).

### B. Modo Administrativo / Gestão (E-mail e Senha Completa)
- **Cenário:** Gerentes, Supervisores e Administradores acessando configurações, financeiro, DRE e relatórios.
- **Interface:**
  - Alternância limpa por aba ("Acesso Rápido Operador" vs "Acesso Administrativo").
  - Campo de E-mail com validação em tempo real de formato.
  - Campo de Senha com botão de alternância para mostrar/ocultar senha (ícones `Eye` / `EyeOff`).
  - Botão "Entrar" com estado de loading, proteção contra cliques repetidos (`disabled` + spinner `Loader2`).
  - Link de "Esqueci minha senha" com modal explicativo seguro (instruindo contato com o administrador do sistema ou fluxo de recuperação).

---

## 3. Matriz de Perfis, Sessão e Rotas Protegidas (RBAC)

Implemente um mecanismo de sessão e guardas de rota centralizado (`AuthGuard` ou wrapper de rota em `src/App.tsx`):

### Matriz de Permissões:
| Perfil | Acesso Permitido | Destino Inicial Padrão | Restrições Específicas |
| :--- | :--- | :--- | :--- |
| **ADMIN** | Acesso irrestrito a todos os módulos, fiscal, usuários e PDV | `/admin` | Nenhuma restrição |
| **GERENTE** | Gestão de caixa, produtos, estoque, clientes, TEF, relatórios e PDV | `/admin` | Não pode alterar parâmetros fiscais críticos ou excluir administradores |
| **OPERADOR_CAIXA** | Exclusivamente Frente de Caixa (`/pdv`) e abertura/fechamento de seu turno | `/pdv` | Bloqueado de acessar `/admin`. Tentativa de saída exige autorização gerencial via `ManagerAuthModal` |
| **ESTOQUISTA** | Módulos de Estoque, Produtos e Entradas de Notas | `/admin` (aba Estoque) | Bloqueado de emitir vendas ou alterar fechamento financeiro |

### Regras de Sessão e Guardas:
1. **Estado de Autenticação:**
   - Armazenar o usuário ativo de forma segura na sessão (`sessionStorage` ou `localStorage` sob chave `FARAH_AUTH_SESSION`).
   - Preservar a sessão ao atualizar a página (F5) sem deslogar indevidamente.
2. **Redirecionamentos Inteligentes:**
   - Se o usuário não estiver autenticado e tentar acessar qualquer tela (`/admin` ou `/pdv`), redirecionar imediatamente para a tela de login.
   - Após login bem-sucedido, direcionar para a rota de destino original ou rota padrão do perfil.
   - Se o usuário já estiver logado e navegar para `/login`, redirecionar para a tela correspondente sem recriar sessão.
3. **Logout Real:**
   - Disponibilizar botão claro de "Sair / Trocar Operador" tanto no cabeçalho do PDV (`PdvHeader`) quanto na barra superior do Admin (`Navbar`).
   - Se houver uma venda com itens no carrinho no PDV, exigir confirmação antes de deslogar para evitar abandono acidental de pedido.
   - Limpar estados sensíveis em memória e redirecionar para a tela de login.

---

## 4. Integração do Operador com o Controle de Caixa (`CashRegister`)

A autenticação do operador deve se comunicar diretamente com o fluxo de caixa:
1. **Verificação de Caixa no Login do Operador:**
   - Ao logar como `OPERADOR_CAIXA`, o sistema deve checar o status do caixa do terminal:
     - Se o caixa estiver fechado, exibir aviso e acionar o modal de **Abertura de Caixa** (informando valor de suprimento/fundo de troco inicial).
     - Se o caixa já estiver aberto sob a responsabilidade de outro operador, exigir autorização gerencial para troca de custodiante ou fechamento de turno anterior.
2. **Vinculação de Identidade em Operações Críticas:**
   - Toda venda concluída deve registrar no objeto `Sale`: `operatorId`, `operatorName` e `cashRegisterId`.
   - Toda sangria ou suprimento de caixa deve gravar quem executou a movimentação e quem autorizou.
   - As emissões de NFC-e devem estampar o nome do operador no cupom fiscal térmico de 80mm.
3. **Trilha de Auditoria:**
   - Cada login, logout, tentativa falha de senha e elevação gerencial deve registrar um evento no log de auditoria do sistema via `StorageService.logAction()`.

---

## 5. Arquitetura de Componentes e Arquivos a Criar/Modificar

### Arquivos a Criar:
- `src/components/Auth/LoginScreen.tsx`: Tela de autenticação completa com abas de Operador (PIN Pad) e Gestão (E-mail/Senha), com o logotipo oficial da Farah (`FarahLogo`), cores oficiais e acessibilidade.
- `src/components/Auth/QuickOperatorPinModal.tsx`: Modal compacto de troca rápida de operador diretamente dentro do PDV sem descarregar a aplicação.
- `src/services/auth.ts`: Serviço modular de autenticação que abstrai a validação de credenciais, sessão ativa, recuperação e listeners de login/logout.

### Arquivos a Atualizar:
- `src/App.tsx`:
  - Incluir a rota de login (`/login`) no roteador SPA nativo.
  - Interceptar rotas protegidas antes de renderizar `AdminLayout` ou `PdvLayout`.
  - Exibir `LoginScreen` se não houver `currentUser` autenticado.
- `src/components/Navbar.tsx`:
  - Atualizar o botão de usuário/logout para invocar a rotina oficial de encerramento de sessão.
- `src/components/PDV/PdvHeader.tsx`:
  - Incluir ação rápida de "Trocar Operador" (com tecla de atalho `F11` ou botão dedicado).
- `src/services/storage.ts`:
  - Assegurar métodos auxiliares para validar credenciais por E-mail + Senha e por Operador + PIN, mantendo compatibilidade com os usuários semeados da Farah.

---

## 6. Critérios de Aceite e Verificação Técnica

A entrega será considerada concluída somente após atender aos seguintes critérios:
1. **Fluxo de Login de Operador:**
   - O operador seleciona seu nome ou digita seu PIN numérico de 4 dígitos.
   - Senha correta: direciona imediatamente para a Frente de Caixa (`/pdv`), identificando o operador no cabeçalho.
   - Senha incorreta: exibe mensagem de erro em português claro ("PIN incorreto") sem vazar dados.
2. **Fluxo de Login de Gestor:**
   - Gestor insere e-mail e senha. Validação previne submissão com campos vazios ou e-mail mal formatado.
   - Ao autenticar, direciona para o Painel Administrativo (`/admin`).
3. **Persistência de Sessão:**
   - Ao recarregar o navegador (F5), a sessão do operador/gestor permanece ativa sem exigir login novamente.
4. **Proteção de Rotas:**
   - Limpar o `localStorage` e acessar qualquer URL força o redirecionamento imediato para a tela de login.
   - Operadores de caixa são impedidos de navegar até o `/admin` sem autorização de senha de gerente.
5. **Auditoria e Caixa:**
   - Vendas e movimentações registram o operador autenticado.
   - Log de auditoria registra eventos de login e logout com timestamp.
6. **Compilação e Qualidade:**
   - Executar `tsc --noEmit` e `npm run build` com **zero erros de compilação ou linting**.
   - Interface totalmente responsiva e esteticamente harmonizada com a identidade da Farah Esfiharia e Pizzaria.
