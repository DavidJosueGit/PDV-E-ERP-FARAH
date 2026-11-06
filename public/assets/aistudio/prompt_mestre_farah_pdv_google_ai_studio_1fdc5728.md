# Prompt mestre --- Integração da tela de login e evolução do Farah PDV

## Contexto

Você está trabalhando no projeto **Farah PDV --- Farah Esfiharia e
Pizzaria**. O projeto já possui uma base de aplicação e uma tela de
autenticação. Sua tarefa é **integrar corretamente a tela de login ao
sistema PDV existente e evoluir o projeto**, sem recriar tudo do zero e
sem remover funcionalidades que já estejam funcionando.

O projeto utiliza, conforme a estrutura existente, tecnologias como
React, TypeScript, TanStack Start, Tailwind CSS e Supabase. Antes de
alterar qualquer arquivo, confirme no código-fonte quais tecnologias,
versões, convenções, rotas, componentes e integrações estão realmente
presentes. Não presuma que a descrição esteja 100% atualizada.

## Objetivo principal

Entregar uma aplicação de ponto de venda utilizável na operação diária
da Farah Esfiharia e Pizzaria, com:

1.  Tela de login integrada ao fluxo real de autenticação.
2.  Rotas protegidas e controle de sessão.
3.  Perfis e permissões aplicados no frontend e no backend.
4.  Cadastro e gerenciamento de produtos e categorias.
5.  Frente de caixa com carrinho e cálculo de venda.
6.  Registro de vendas e pagamentos.
7.  Abertura, movimentação e fechamento de caixa.
8.  Estrutura preparada para estoque, fichas técnicas, cozinha e
    relatórios.
9.  Interface responsiva, acessível e coerente com a identidade visual
    da Farah.
10. Testes, tratamento de erros e documentação das alterações.

**Não entregue apenas um protótipo visual.** Implemente os fluxos
funcionais conectados ao Supabase quando as credenciais e o ambiente
permitirem. Se alguma integração depender de configuração externa,
implemente a estrutura segura, documente exatamente o que falta e não
simule que a operação foi concluída.

------------------------------------------------------------------------

# 1. Regras obrigatórias antes de começar

1.  Inspecione todo o repositório, incluindo `package.json`, rotas,
    componentes, hooks, serviços, migrations, políticas RLS, testes e
    arquivos de configuração.
2.  Identifique como a autenticação Supabase está configurada e
    reutilize a implementação existente sempre que estiver correta.
3.  Faça um diagnóstico curto dos arquivos que serão alterados e
    explique o plano antes de implementar.
4.  Preserve a arquitetura, as dependências e os padrões já adotados.
    Não migre de framework nem substitua bibliotecas sem necessidade
    comprovada.
5.  Não apague nem sobrescreva código funcional sem justificar e
    preservar seu comportamento.
6.  Não invente tabelas, colunas, variáveis de ambiente, endpoints ou
    APIs sem verificar sua existência ou criar as migrations
    correspondentes.
7.  Não coloque chaves secretas no frontend. Nunca exponha
    `service_role`, senhas ou tokens privados.
8.  Não use dados fictícios como se fossem dados reais. Se precisar de
    dados de demonstração, identifique-os claramente e mantenha-os
    separados dos dados de produção.
9.  Faça alterações em etapas pequenas e verificáveis.
10. Ao final de cada etapa, execute os testes e verificações disponíveis
    e corrija os erros introduzidos.

# 2. Tela de login e integração com o PDV

Integre a tela de login existente ao sistema. Se ela já estiver
implementada, melhore-a sem descaracterizar seu visual.

## Requisitos visuais

-   Manter a identidade visual da Farah: vermelho, amarelo, creme e tons
    escuros, respeitando os tokens e estilos existentes.
-   Layout profissional, limpo e responsivo.
-   Campos de e-mail e senha com rótulos claros.
-   Botão para mostrar/ocultar senha.
-   Botão de entrar com estados de carregamento e prevenção de envios
    duplicados.
-   Mensagens de erro em português, claras e sem revelar detalhes
    sensíveis.
-   Link funcional para recuperação de senha.
-   Logo e identificação da Farah, usando os assets existentes.
-   Boa experiência em computador, tablet e celular.
-   Acessibilidade por teclado, foco visível, contraste adequado e
    atributos apropriados.

## Requisitos funcionais

-   Usar o Supabase Auth já configurado no projeto.
-   Validar campos obrigatórios e formato do e-mail.
-   Autenticar com credenciais reais, sem criar autenticação paralela ou
    guardar senha no navegador.
-   Manter a sessão de forma segura conforme o SDK e a arquitetura já
    utilizados.
-   Restaurar a sessão ao atualizar a página.
-   Tratar sessão expirada, falha de rede, credenciais inválidas e
    usuário desativado, quando esse estado existir no modelo.
-   Implementar recuperação de senha usando o fluxo oficial do Supabase
    e a URL de retorno correta.
-   Após login, carregar o perfil e as permissões do usuário antes de
    liberar áreas protegidas.
-   Redirecionar para a rota de destino originalmente solicitada após
    login, quando aplicável.
-   Impedir que um usuário autenticado volte desnecessariamente à tela
    de login.
-   Implementar logout real, limpar estados sensíveis e redirecionar
    para login.
-   Não considerar o usuário autorizado apenas porque existe uma sessão:
    verificar também o perfil e as permissões necessárias.

## Rotas protegidas

-   Centralizar a verificação de autenticação em um guard compatível com
    TanStack Start.
-   Proteger todas as rotas internas, não apenas a página principal do
    PDV.
-   Validar autorização no servidor nas operações sensíveis.
-   Não depender exclusivamente de redirecionamentos ou controles
    visuais no cliente.
-   Evitar loops de redirecionamento durante carregamento ou recuperação
    de sessão.
-   Tratar estados distintos: carregando, autenticado, não autenticado,
    sem perfil e sem permissão.

# 3. Usuários, perfis e permissões

Considere os perfis existentes no projeto e confirme-os no banco antes
de alterar.

Como referência funcional:

  -----------------------------------------------------------------------
  Perfil                              Permissões esperadas
  ----------------------------------- -----------------------------------
  Administrador                       Acesso total, configurações,
                                      usuários, produtos, vendas,
                                      estoque, financeiro e relatórios

  Gerente                             Operação e gestão autorizadas,
                                      relatórios, caixa e supervisão

  Operador                            Abrir/operar caixa conforme
                                      autorização, registrar vendas e
                                      consultar somente os dados
                                      necessários
  -----------------------------------------------------------------------

Requisitos:

-   Criar uma matriz explícita de permissões por ação e módulo.
-   Aplicar permissões no frontend para orientar a interface e no
    backend/banco para garantir segurança.
-   Não confiar em `role` enviado pelo navegador.
-   Obter identidade e permissões a partir da sessão autenticada e de
    dados confiáveis.
-   Criar políticas RLS para cada tabela com acesso por usuário, função
    e contexto de negócio.
-   Bloquear por padrão o acesso não autorizado.
-   Registrar operações críticas em auditoria: descontos, cancelamentos,
    estornos, alterações de preço, movimentações de caixa e mudanças de
    permissões.
-   Não permitir que um operador altere seu próprio perfil ou eleve
    privilégios.

# 4. Banco de dados e Supabase

Inspecione o schema e as migrations atuais. Crie migrations versionadas,
incrementais e reversíveis sempre que possível. Não faça alterações
manuais não documentadas no banco.

Planeje e implemente, conforme a arquitetura encontrada, as entidades
necessárias:

-   Perfis de usuário e permissões.
-   Categorias.
-   Produtos.
-   Variações, tamanhos e adicionais, se necessários ao cardápio.
-   Clientes.
-   Vendas.
-   Itens de venda.
-   Pagamentos.
-   Caixas e sessões de caixa.
-   Movimentações de caixa.
-   Movimentações de estoque.
-   Ingredientes e fichas técnicas, em etapa própria.
-   Auditoria de ações críticas.

## Regras de modelagem

-   Usar UUIDs e timestamps coerentes com o padrão atual.
-   Definir chaves estrangeiras, índices, restrições e valores padrão.
-   Armazenar valores monetários em centavos (inteiro) ou em tipo
    decimal apropriado; nunca usar ponto flutuante para cálculos
    financeiros.
-   Guardar preço e descrição aplicados no momento da venda nos itens da
    venda, para preservar o histórico mesmo se o cadastro mudar.
-   Definir estados válidos para vendas, pagamentos e caixas.
-   Evitar exclusão física de registros financeiros; usar
    cancelamento/estorno com histórico.
-   Definir `created_at`, `updated_at` e, quando pertinente, usuário
    responsável.
-   Criar políticas RLS para leitura e escrita de cada tabela.
-   Validar operações críticas no servidor ou em funções SQL
    transacionais.
-   Criar índices para consultas frequentes, sem indexar
    indiscriminadamente.

## Segurança Supabase

-   Usar somente a chave publicável/anon no cliente, conforme a
    configuração atual.
-   Manter `service_role` exclusivamente em ambiente confiável de
    servidor, se realmente necessário.
-   Nunca inserir secrets em arquivos versionados.
-   Adicionar `.env` e variantes reais ao `.gitignore`.
-   Criar `.env.example` apenas com nomes das variáveis e valores
    ilustrativos não secretos.
-   Verificar se o `.env` atual contém credenciais reais. Se houver
    exposição, orientar a rotação das credenciais no painel do Supabase;
    não copiar nem exibir seus valores.
-   Não desabilitar RLS para facilitar a implementação.
-   Documentar as migrations e os passos de configuração do Supabase.

# 5. Produtos e categorias

Criar uma área administrativa para:

-   Listar, pesquisar e filtrar produtos.
-   Criar e editar produtos.
-   Ativar/desativar produtos sem apagar o histórico.
-   Organizar categorias, como pizzas, esfihas, bebidas e sobremesas.
-   Cadastrar nome, descrição, preço, imagem opcional, categoria e
    disponibilidade.
-   Suportar tamanhos, sabores e adicionais quando aplicável ao
    cardápio.
-   Validar preço e campos obrigatórios.
-   Impedir que produtos indisponíveis sejam adicionados a novas vendas.
-   Manter histórico de preços ou, no mínimo, preservar o preço
    registrado em cada venda.

A interface deve ser simples para que um gerente consiga atualizar o
cardápio sem conhecimento técnico.

# 6. Frente de caixa (PDV)

Criar uma tela de venda rápida, priorizando computador e touchscreen,
sem prejudicar tablets e celulares.

## Organização visual sugerida

-   Cabeçalho com nome da loja, operador logado, data/hora e status do
    caixa.
-   Área de categorias.
-   Grade de produtos com nome, preço e imagem opcional.
-   Busca rápida por nome.
-   Carrinho sempre visível em telas largas; em telas menores, usar
    painel adaptável.
-   Resumo com subtotal, desconto autorizado e total.
-   Ações claras para limpar, suspender ou finalizar venda, quando
    implementadas com segurança.

## Operações

-   Adicionar produto ao carrinho.
-   Aumentar/diminuir quantidade.
-   Remover item.
-   Selecionar tamanho, sabor e adicionais quando cadastrados.
-   Informar observações do item ou pedido.
-   Calcular subtotal e total automaticamente.
-   Aplicar desconto apenas com permissão adequada e registrar
    responsável e justificativa.
-   Associar cliente opcionalmente.
-   Impedir quantidade inválida, preço negativo e produto indisponível.
-   Confirmar antes de descartar um carrinho com itens.
-   Evitar duplicidade de venda em cliques repetidos ou falhas de rede.

## Consistência financeira

-   Calcular valores monetários em centavos ou decimal seguro.
-   Recalcular valores no servidor; não confiar no total enviado pelo
    cliente.
-   Registrar o preço vigente no momento da venda.
-   Usar operação transacional para criar venda, itens e pagamentos.
-   Garantir idempotência ou mecanismo equivalente na finalização,
    evitando vendas duplicadas.
-   Não marcar uma venda como paga antes de confirmar o registro do
    pagamento.

# 7. Pagamentos

Implementar registro de pagamentos por:

-   Dinheiro.
-   PIX.
-   Cartão de débito.
-   Cartão de crédito.

Nesta etapa, registrar a forma de pagamento e os valores recebidos.
**Não afirmar que existe integração bancária, adquirente, TEF ou
confirmação automática de PIX se isso não estiver configurado.**

Requisitos:

-   Permitir pagamento único e, se necessário, divisão entre formas de
    pagamento.
-   Validar que a soma dos pagamentos corresponde ao total devido.
-   Calcular troco corretamente em pagamentos em dinheiro.
-   Registrar status, valor, forma, data e responsável.
-   Permitir cancelamento/estorno apenas com autorização e trilha de
    auditoria.
-   Nunca armazenar número completo de cartão, CVV ou dados sensíveis de
    cartão.

# 8. Abertura, movimentação e fechamento de caixa

Criar fluxo completo de caixa:

## Abertura

-   Exigir abertura antes de registrar vendas, conforme a regra de
    negócio.
-   Registrar operador, data/hora e valor inicial.
-   Impedir duas sessões abertas simultaneamente para o mesmo caixa, se
    essa for a regra definida.

## Movimentações

-   Registrar sangria e reforço.
-   Exigir valor, motivo e usuário responsável.
-   Registrar entradas e saídas sem apagar histórico.
-   Restringir operações conforme as permissões.

## Fechamento

-   Calcular total esperado por forma de pagamento.
-   Informar valor contado pelo operador.
-   Comparar esperado e contado.
-   Exibir diferenças por forma de pagamento e total geral.
-   Exigir justificativa quando houver divergência, conforme regra
    definida.
-   Registrar responsável, horário e valores finais.
-   Impedir alterações silenciosas após fechamento.
-   Permitir reabertura somente a perfil autorizado, com justificativa e
    auditoria.

# 9. Estoque e fichas técnicas

Preparar a arquitetura para controle de estoque sem misturar estoque
físico com quantidade vendida.

Funcionalidades planejadas:

-   Cadastro de ingredientes e insumos.
-   Unidade de medida e conversões controladas.
-   Entrada, saída, perda e ajuste de estoque.
-   Estoque mínimo e alerta de reposição.
-   Histórico de movimentações.
-   Ficha técnica por produto, tamanho e variação.
-   Baixa automática de ingredientes ao confirmar uma venda, quando a
    ficha técnica estiver cadastrada.
-   Estorno coerente da movimentação em caso de cancelamento, sem apagar
    o histórico.

Se o escopo for grande para uma única execução, primeiro entregue a
estrutura do banco e a interface básica, documentando claramente o que
ficou pendente. Não simule baixa de estoque sem dados reais de ficha
técnica.

# 10. Pedidos e cozinha

Preparar módulo para acompanhar pedidos:

-   Recebido.
-   Em preparo.
-   Pronto.
-   Saiu para entrega, se houver entrega.
-   Concluído.
-   Cancelado.

Exibir número do pedido, horário, itens, adicionais e observações.
Restringir transições de status conforme as regras de negócio. Não
implementar integração com delivery externo sem credenciais e
especificação.

# 11. Relatórios e painel gerencial

Criar painel com filtros por período e indicadores:

-   Faturamento bruto e líquido.
-   Quantidade de vendas.
-   Ticket médio.
-   Vendas por forma de pagamento.
-   Produtos mais vendidos.
-   Descontos.
-   Cancelamentos e estornos.
-   Movimentações de caixa.
-   Desempenho por operador, respeitando permissões.

Diferenciar faturamento, recebimentos, lucro e saldo de caixa. Não
chamar faturamento de lucro. Só calcular lucro quando houver custos
confiáveis cadastrados. Exibir estados vazios e mensagens claras quando
não houver dados.

# 12. Interface e experiência de uso

Manter a identidade visual existente da Farah, sem criar uma marca nova.

Diretrizes:

-   Vermelho, amarelo, creme e tons escuros conforme os estilos
    existentes.
-   Menu lateral organizado por módulos.
-   Cabeçalho com usuário, data/hora e situação do caixa.
-   Botões grandes e claros para ações frequentes.
-   Hierarquia visual consistente.
-   Feedback de sucesso, erro e carregamento.
-   Confirmação para ações destrutivas ou financeiras.
-   Tabelas com busca, filtros e paginação quando necessário.
-   Estados vazios úteis.
-   Layout responsivo e acessível.
-   Navegação por teclado e foco visível.
-   Textos em português do Brasil.
-   Configurar idioma do documento como `pt-BR`.
-   Padronizar moeda em BRL (`R$`) e datas no padrão brasileiro,
    respeitando timezone configurado para a loja.
-   Não usar emojis como substitutos de ícones funcionais.
-   Não inventar imagens ou dados de produtos como se fossem oficiais da
    Farah.

# 13. Qualidade técnica, erros e testes

Corrigir os pontos existentes que forem confirmados na inspeção:

-   Tratar erros e estados de carregamento ao buscar perfil e
    permissões.
-   Tratar falhas de logout e recuperação de senha.
-   Corrigir textos e rótulos que não correspondam ao comportamento
    real.
-   Verificar configuração de idioma do documento.
-   Definir schema Drizzle somente se ele fizer parte da arquitetura
    realmente utilizada; evitar manter duas fontes de verdade
    incompatíveis entre Drizzle e Supabase migrations.
-   Melhorar os testes de guardas de rota.
-   Adicionar testes de autenticação, permissões, carrinho, cálculo
    financeiro, finalização, pagamentos e caixa.
-   Testar usuários sem perfil, sem permissão, sessão expirada e falha
    de rede.
-   Adicionar testes para evitar venda duplicada e divergência de
    valores.
-   Executar lint, typecheck, testes e build com os scripts existentes.
-   Corrigir erros introduzidos antes de concluir.

Não remova testes para fazer o build passar. Se um teste falhar por
comportamento preexistente, identifique-o separadamente.

# 14. Arquivos de ambiente e documentação

-   Revisar `.gitignore`.
-   Ignorar `.env`, `.env.local` e arquivos reais de credenciais.
-   Criar/atualizar `.env.example` sem segredos.
-   Não imprimir valores de variáveis secretas nos logs.
-   Documentar variáveis necessárias, migrations, configuração do
    Supabase, criação do primeiro administrador e configuração de URLs
    de autenticação.
-   Não criar um administrador com senha padrão fixa.
-   Orientar a criação segura do primeiro administrador por procedimento
    controlado.

# 15. Plano de execução por fases

Implemente em fases para reduzir riscos:

## Fase 1 --- Auditoria e autenticação

-   Inspecionar o projeto.
-   Integrar e validar a tela de login.
-   Recuperação de senha, sessão, logout e rotas protegidas.
-   Perfil e permissões.
-   Segurança de ambiente e RLS inicial.
-   Testes da autenticação.

## Fase 2 --- Banco comercial e catálogo

-   Migrations de categorias e produtos.
-   CRUD de produtos e categorias.
-   Permissões e testes.

## Fase 3 --- Frente de caixa

-   Interface do PDV.
-   Carrinho e cálculos.
-   Registro transacional de venda e itens.
-   Testes financeiros.

## Fase 4 --- Pagamentos e caixa

-   Formas de pagamento.
-   Abertura, movimentações e fechamento.
-   Auditoria e testes.

## Fase 5 --- Gestão

-   Estoque e fichas técnicas.
-   Pedidos e cozinha.
-   Relatórios e painel.

**Comece pela Fase 1 e avance para as demais somente após validar a fase
anterior.** Se o ambiente permitir executar o projeto, faça isso e
verifique o resultado. Se não permitir, informe a limitação sem alegar
que testou.

# 16. Critérios de aceite

Considere a entrega aprovada somente quando:

-   Um usuário válido consegue entrar pela tela integrada.
-   Um usuário inválido recebe mensagem apropriada.
-   A sessão persiste após atualização conforme esperado.
-   Rotas internas não são acessíveis sem autenticação.
-   Um usuário sem permissão não consegue executar a operação nem
    diretamente pela API/banco.
-   O logout encerra a sessão.
-   A recuperação de senha segue o fluxo configurado.
-   Produtos podem ser cadastrados e consultados com persistência real.
-   O carrinho calcula valores corretamente.
-   A venda é registrada sem duplicidade.
-   Pagamentos são registrados e conciliam com o total.
-   O caixa registra abertura, movimentações e fechamento.
-   As políticas RLS impedem acessos indevidos.
-   Não há secrets expostos no frontend ou no repositório.
-   Testes, typecheck, lint e build são executados; resultados e
    limitações são informados.
-   A interface funciona em computador, tablet e celular.

# 17. Formato da resposta final

Ao concluir cada fase, apresente:

1.  Resumo do que foi implementado.
2.  Arquivos criados e alterados.
3.  Migrations e políticas RLS adicionadas.
4.  Variáveis de ambiente necessárias, sem revelar valores secretos.
5.  Configurações manuais que ainda dependem do proprietário do projeto.
6.  Testes executados e resultados reais.
7.  Problemas conhecidos e itens ainda pendentes.
8.  Próxima fase recomendada.

**Importante:** não responda apenas com um plano ou trechos de código.
Faça as alterações no projeto aberto, respeitando sua estrutura. Não
declare uma funcionalidade concluída sem implementá-la e validá-la.
