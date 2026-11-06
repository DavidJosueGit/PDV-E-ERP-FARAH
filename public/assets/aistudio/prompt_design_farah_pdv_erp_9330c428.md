# Prompt de Redesign Visual --- Farah \| PDV & ERP

## Instrução principal

Atue como **Product Designer Sênior especializado em UI/UX para sistemas
comerciais de alimentação, restaurantes, esfiharias, pizzarias,
lanchonetes e operações de varejo alimentar**, com experiência em
sistemas SaaS, painéis administrativos e pontos de venda (PDV).

Redesenhe visualmente o frontend existente do sistema PDV & ERP para que
ele tenha uma identidade comercial própria, inspirada na marca **Farah
Esfiharia e Pizzaria** e nas três imagens de referência fornecidas pelo
usuário.

Utilize as orientações da skill **UI/UX Pro Max**
(`nextlevelbuilder/ui-ux-pro-max-skill`) como metodologia de trabalho:
escolha de estilo, design system, hierarquia visual, tipografia, cores,
acessibilidade, responsividade, padrões de interação, formulários,
navegação e visualização de dados.

**As imagens anexadas são referências visuais obrigatórias.** Analise-as
antes de propor o design: 1. **Logo Farah:** círculo amarelo, lettering
vermelho, ilustração de camelos em preto, contorno claro e fundo escuro.
Preserve a personalidade e a paleta da marca. 2. **Imagem promocional de
esfiha/pizza:** referência de fotografia de produto, apelo gastronômico,
cores quentes e comunicação promocional. 3. **Foto das esfihas
servidas:** referência de produto real, apresentação do alimento, prato
branco, limão e ambiente de consumo.

Não redesenhe nem distorça o logotipo. Utilize a imagem original da
marca sempre que houver espaço adequado. Não invente uma versão
alternativa do símbolo ou do lettering.

------------------------------------------------------------------------

## 1. Identidade da marca e paleta obrigatória

O sistema será personalizado para a operação da **Farah Esfiharia e
Pizzaria**. O design deve transmitir uma marca de alimentação
acolhedora, reconhecível, apetitosa e profissional, sem perder a clareza
operacional de um ERP.

### Cores oficiais obrigatórias

As cores principais fornecidas pelo usuário são:

  -----------------------------------------------------------------------
  Token                   Hex                     Aplicação
  ----------------------- ----------------------- -----------------------
  `brand-yellow`          `#FFCC33`               Cor principal da marca,
                                                  destaques, elementos
                                                  selecionados e chamadas
                                                  importantes

  `brand-red`             `#CF1020`               Cor secundária forte,
                                                  ações de destaque,
                                                  botões principais
                                                  pontuais e elementos de
                                                  identidade
  -----------------------------------------------------------------------

**Use exatamente os códigos `#FFCC33` e `#CF1020`.** Não os substitua
por tons aproximados.

### Cores de apoio sugeridas

  -----------------------------------------------------------------------
  Token                   Hex                     Aplicação
  ----------------------- ----------------------- -----------------------
  `brand-charcoal`        `#242424`               Cabeçalhos, navegação
                                                  escura e contraste

  `surface`               `#FFFFFF`               Conteúdo, formulários e
                                                  tabelas

  `background`            `#F6F5F1`               Fundo geral claro e
                                                  neutro

  `text-primary`          `#252525`               Texto principal

  `text-secondary`        `#6B6862`               Texto secundário

  `border`                `#E7E2D8`               Divisórias e contornos

  `success`               `#26734D`               Confirmação e estados
                                                  positivos

  `warning`               `#D97706`               Atenção e avisos

  `danger`                `#B42318`               Erros e situações
                                                  críticas
  -----------------------------------------------------------------------

A paleta deve ter equilíbrio. O amarelo `#FFCC33` e o vermelho `#CF1020`
são cores de identidade, mas não devem ocupar grandes áreas
simultaneamente em todas as telas. Use fundos neutros para manter
legibilidade e aparência profissional.

**Regras de contraste:** - Não use texto branco pequeno sobre amarelo. -
Prefira texto carvão sobre amarelo. - Use branco sobre vermelho somente
quando o contraste for suficiente. - Não use amarelo ou vermelho como
única forma de indicar status. - Verifique contraste WCAG AA nos textos
e controles.

### Personalidade visual

A combinação deve refletir as referências: - Amarelo quente e marcante
da identidade Farah; - Vermelho forte do logotipo e da comunicação
promocional; - Preto/carvão para contraste e sofisticação; - Branco e
tons quentes neutros para organizar informações; - Fotografia real de
esfihas e pizzas como apoio visual em locais apropriados.

O resultado deve parecer um software real de uma empresa de alimentação,
não um template genérico de dashboard e nem uma página publicitária.

------------------------------------------------------------------------

## 2. Direção de design do produto

Crie uma interface de gestão de restaurante/esfiharia/pizzaria que
combine:

-   Identidade visual da Farah;
-   Organização de software empresarial;
-   Operação rápida de caixa;
-   Gestão clara de produtos e complementos;
-   Gestão de pedidos e vendas;
-   Controle de estoque e insumos;
-   Gestão financeira e relatórios.

Use um estilo **commercial food service / restaurant management SaaS**:
funcional, limpo, confiável e com personalidade gastronômica.

Evite: - Gradientes exagerados; - Cards em excesso; - Cantos
excessivamente arredondados; - Sombras pesadas; - Emojis como ícones; -
Ilustrações genéricas de comida; - Fotos decorativas em todas as
telas; - Cores aleatórias fora da paleta; - Tipografia caricata ou
infantil; - Animações sem função; - Aparência de landing page dentro do
sistema de gestão.

Use ícones SVG consistentes, preferencialmente da biblioteca já
instalada no projeto. Não adicione dependências sem necessidade.

------------------------------------------------------------------------

## 3. Design system compartilhado

Antes de alterar as páginas, defina um design system consistente para
todo o sistema.

Inclua:

1.  Tokens de cores da marca e cores semânticas;
2.  Tipografia e escala de tamanhos;
3.  Escala de espaçamento;
4.  Raios de borda e sombras;
5.  Botões primários, secundários, terciários e destrutivos;
6.  Campos, seletores, pesquisa e formulários;
7.  Tabelas, paginação, filtros e ordenação;
8.  Badges de status;
9.  Modais, menus e notificações;
10. Navegação lateral e cabeçalho;
11. Estados de carregamento, vazio, erro e sucesso;
12. Componentes de preço, quantidade e valores monetários;
13. Regras de responsividade e acessibilidade.

A identidade Farah deve ser reconhecível em `/admin` e `/pdv`, mas cada
área precisa de uma organização adequada à sua finalidade.

------------------------------------------------------------------------

## 4. Painel administrativo `/admin`

O painel administrativo deve ser uma ferramenta de gestão diária, com
leitura rápida e organização de dados.

### Navegação

-   Utilize navegação lateral consistente, com agrupamento lógico dos
    módulos.
-   Aplique o amarelo `#FFCC33` de forma controlada para seleção, realce
    ou pequenos indicadores.
-   Use carvão para estrutura e contraste.
-   Reserve o vermelho `#CF1020` para ações importantes e destaques
    pontuais.
-   Mantenha o conteúdo principal claro e organizado.
-   Preserve a estrutura de rotas e os módulos existentes.

### Dashboard

Quando os dados reais estiverem disponíveis, priorize: - Vendas do
dia; - Quantidade de pedidos/vendas; - Ticket médio; - Produtos mais
vendidos; - Itens com estoque baixo; - Resumo financeiro; - Pedidos em
andamento, caso o projeto possua esse fluxo.

Use indicadores compactos, gráficos simples e tabelas legíveis. Não
invente dados, vendas, pedidos, produtos ou indicadores. Se uma
informação não estiver conectada ao backend, mostre estado vazio ou
indisponibilidade claramente identificada.

### Produtos e cardápio

Adapte a apresentação para uma operação de esfiharia e pizzaria,
respeitando os campos realmente existentes: - Nome do produto; -
Categoria; - Código/SKU; - Preço de venda; - Custo, quando disponível; -
Disponibilidade; - Unidade; - Variações, tamanhos ou sabores, somente se
já suportados.

Quando houver imagem real de produto, use-a com proporção consistente e
sem cortes que prejudiquem a identificação. Não invente fotografias ou
imagens de produtos da Farah.

### Estoque e insumos

A interface deve facilitar o controle de: - Produtos e insumos; -
Entradas e saídas; - Quantidades; - Estoque mínimo; - Alertas; -
Histórico de movimentações.

Não confunda estoque de produtos vendidos com estoque de ingredientes.
Só apresente controle de insumos, fichas técnicas ou baixa automática se
o backend já oferecer suporte.

### Clientes, fornecedores, financeiro e relatórios

-   Use formulários com rótulos visíveis e agrupamentos lógicos.
-   Use tabelas profissionais com filtros e pesquisa.
-   Formate moeda e quantidades consistentemente.
-   Diferencie receita, despesa, saldo e lucro.
-   Utilize vermelho para alertas relevantes, não para decorar.
-   Utilize verde para estados positivos.
-   Gráficos devem possuir legendas e rótulos compreensíveis.
-   Não apresente valores simulados como dados reais.

### Usuários, configurações e auditoria

Mantenha permissões, ações críticas, estados de conta e histórico
claros. Ações destrutivas devem exigir confirmação.

------------------------------------------------------------------------

## 5. Frente de caixa `/pdv`

O PDV deve ser redesenhado para atender com agilidade clientes de uma
esfiharia e pizzaria.

**A prioridade absoluta é velocidade de operação e clareza, não
decoração.**

### Organização visual

-   Área de pesquisa e inclusão de produtos fácil de localizar;
-   Categorias de produtos organizadas, se suportadas;
-   Produtos com nome e preço claramente legíveis;
-   Imagens reais de produtos apenas quando disponíveis;
-   Carrinho/pedido sempre visível e fácil de revisar;
-   Quantidade, adicionais e observações, somente se suportados;
-   Subtotal, descontos e total com hierarquia clara;
-   Pagamento e finalização em área de destaque;
-   Troco e valor recebido fáceis de conferir;
-   Feedback imediato ao adicionar, remover ou alterar itens.

### Aplicação das cores Farah

-   Use `#FFCC33` para identificação da marca, categoria selecionada,
    pequenos destaques e elementos de orientação.
-   Use `#CF1020` para a ação principal de finalização ou ações
    importantes, sem transformar todos os botões em vermelho.
-   Use carvão para textos e áreas estruturais.
-   Use superfícies brancas ou neutras para produtos e carrinho.
-   Garanta contraste em botões e textos.

### Experiência de caixa

-   Botões de ações frequentes com área de interação confortável;
-   Operação por teclado quando já suportada;
-   Busca rápida;
-   Estados de processamento e confirmação;
-   Prevenção de cliques duplicados durante o processamento;
-   Confirmação para cancelamento e ações críticas;
-   Nenhuma animação deve atrasar a venda.

Não altere regras de preço, desconto, pagamento, cálculo de troco,
finalização ou cancelamento para acomodar o novo design.

------------------------------------------------------------------------

## 6. Uso das imagens fornecidas

Use as três imagens anexadas como referências visuais reais da marca e
do produto.

### Logotipo

-   Utilize o logotipo original da Farah.
-   Preserve proporções, cores, lettering e ilustrações.
-   Não redesenhe, vetorize automaticamente ou altere o conteúdo do
    logo.
-   Em espaços pequenos, use uma versão reduzida proporcional ou apenas
    o nome da marca se isso já existir como recurso autorizado.

### Fotografias de alimentos

-   Use a foto promocional e a foto das esfihas servidas como referência
    de linguagem gastronômica.
-   Priorize fotografias reais em áreas em que a imagem ajude a
    reconhecer o produto, como catálogo do PDV ou apresentação de
    produtos.
-   Não utilize a foto de um prato para representar um produto
    diferente.
-   Não aplique filtros fortes nem cortes que escondam o alimento.
-   Não espalhe fotos decorativas em páginas administrativas como
    financeiro, usuários ou auditoria.
-   Se o projeto não tiver os arquivos de imagem acessíveis no ambiente
    de desenvolvimento, não tente inventar caminhos ou URLs. Solicite os
    arquivos ou mantenha espaços reservados adequados.

### Aplicações recomendadas

-   Logo na navegação e na identificação da loja;
-   Fotografia de produtos no catálogo do PDV, quando apropriado;
-   Pequenas áreas promocionais apenas se houver funcionalidade real
    para isso;
-   Não transforme o ERP em uma peça publicitária.

------------------------------------------------------------------------

## 7. UX, acessibilidade e responsividade

Siga boas práticas de acessibilidade: - Contraste compatível com WCAG AA
sempre que aplicável; - Rótulos visíveis nos campos; - Nomes acessíveis
para botões e ícones; - Foco de teclado visível; - Navegação por teclado
nos fluxos relevantes; - Mensagens de erro próximas aos campos; -
Feedback durante carregamento e salvamento; - Estados vazios úteis; -
Não comunicar status somente por cor; - Não causar rolagem horizontal
desnecessária; - Não utilizar texto pequeno demais; - Alvos de toque
próximos ou superiores a 44 × 44 px quando aplicável.

Priorize desktop para as operações de gestão e caixa, sem abandonar
adaptação a telas menores.

------------------------------------------------------------------------

## 8. Preservação técnica e funcional

Estas regras são obrigatórias:

1.  Inspecione a stack, estrutura e dependências antes de implementar.
2.  Reutilize componentes e bibliotecas já existentes quando apropriado.
3.  Não substitua a tecnologia do projeto.
4.  Não altere o backend Java.
5.  Não modifique banco de dados, entidades, APIs ou contratos.
6.  Não remova funcionalidades existentes.
7.  Não troque integrações reais por dados fictícios.
8.  Preserve as rotas `/admin` e `/pdv`.
9.  Preserve autenticação, permissões e sessões.
10. Não instale dependências sem necessidade e justificativa.
11. Não refatore partes não relacionadas ao redesign.
12. Não altere regras de negócio para facilitar o layout.
13. Não invente funcionalidades que não existam no backend.
14. Não faça alterações em massa sem validar as telas e os fluxos
    afetados.

------------------------------------------------------------------------

## 9. Etapas de trabalho

### Etapa 1 --- Auditoria

Inspecione o frontend atual e identifique: - Stack e dependências; -
Rotas e páginas; - Componentes compartilhados; - Estrutura visual
atual; - Telas de `/admin`; - Telas de `/pdv`; - Integrações e
comportamentos existentes; - Problemas de usabilidade; - Locais
apropriados para aplicação da marca e das imagens.

**Não altere código nesta etapa.**

### Etapa 2 --- Proposta visual

Apresente: - Paleta final baseada obrigatoriamente em `#FFCC33` e
`#CF1020`; - Tipografia; - Design system; - Layout proposto para o
administrativo; - Layout proposto para o PDV; - Aplicação do logotipo e
das fotografias; - Justificativa de usabilidade.

Aguarde aprovação antes de implementar.

### Etapa 3 --- Implementação do administrativo

Implemente o design system e aplique-o progressivamente ao `/admin`.
Preserve todos os comportamentos existentes e teste cada tela alterada.

### Etapa 4 --- Implementação do PDV

Aplique a identidade Farah ao `/pdv`, otimizando a operação do caixa e
preservando o fluxo real de vendas.

### Etapa 5 --- Validação

Teste: - Navegação; - Pesquisa; - Formulários; - Tabelas e filtros; -
Inclusão e remoção de itens; - Cálculos e totais; - Pagamento e
finalização; - Cancelamento; - Responsividade; - Acessibilidade; - Build
e erros de console.

------------------------------------------------------------------------

## 10. Critério de conclusão

O resultado deve parecer um sistema comercial SaaS desenvolvido para uma
empresa real de alimentação, com a identidade visual Farah aplicada de
forma profissional.

A marca deve ser reconhecível, mas o sistema deve continuar priorizando
produtividade, legibilidade e precisão operacional.

**Não basta trocar as cores:** reorganize hierarquia, espaçamento,
navegação, componentes e densidade de informação quando necessário,
sempre preservando as funcionalidades existentes.

------------------------------------------------------------------------

## Instrução para iniciar

Comece somente pela **Etapa 1 --- Auditoria**.

Analise as imagens anexadas e o frontend existente. Não instale
dependências, não modifique arquivos e não altere funcionalidades ainda.

Entregue um diagnóstico da estrutura atual e uma proposta visual
específica para a Farah Esfiharia e Pizzaria, contemplando `/admin` e
`/pdv`.

**Aguarde minha aprovação antes de iniciar qualquer implementação.**
