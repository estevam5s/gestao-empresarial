# Plano de Precos SaaS - GestaoZe System

Data da analise: 16/06/2026  
Moeda: Real brasileiro (BRL)  
Modelo sugerido: SaaS B2B para restaurantes, bares, lanchonetes, pequenas redes de alimentacao e negocios com estoque perecivel.

## 1. Resumo executivo

O GestaoZe System ja possui uma base forte para virar SaaS: autenticacao, multi-tenancy, isolamento por empresa, dashboard, estoque, financeiro, funcionarios, fornecedores, cardapio, relatorios, IA, logs, auditoria, API, suporte, paginas publicas e fluxo de cadastro. A precificacao deve capturar esse valor sem competir apenas por preco.

Embora o pedido mencione "4 tipos de plano", os nomes solicitados formam 5 ofertas. A recomendacao e manter 5 planos:

1. Inicial - gratis
2. Starter
3. Pro
4. Enterprise
5. Vitalicio

Essa estrutura permite aquisicao com plano gratis, conversao para microempresas no Starter, monetizacao principal no Pro, venda consultiva para redes no Enterprise e uma oferta premium de caixa antecipado no Vitalicio.

## 2. Analise de mercado

### Referencias atuais observadas

O mercado brasileiro de sistemas de gestao/ERP para pequenas empresas costuma precificar por uma combinacao de volume operacional, usuarios, suporte, automacoes, integracoes e recursos fiscais/financeiros.

Referencias usadas:

- Bling, pagina oficial de planos: https://www.bling.com.br/planos-e-precos
- Conta Azul, visao geral de ERP em nuvem para MPEs: https://pt.wikipedia.org/wiki/Conta_Azul
- LGPD, Lei 13.709/2018: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Codigo de Defesa do Consumidor, Lei 8.078/1990: https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm

Na consulta de mercado, o Bling apresenta planos publicos com preco mensal de referencia em torno de R$ 55/mês no plano de entrada, R$ 120/mês em plano intermediario, R$ 650/mês em plano avancado e plano Elite com valor personalizado. Tambem inclui usuarios, pedidos, estoque, financeiro, notas fiscais, atendimento, integracoes e recursos avancados conforme o plano.

### Posicionamento recomendado para o GestaoZe

O GestaoZe nao deve se posicionar como ERP generico no inicio. O melhor posicionamento e:

> "Sistema SaaS de gestao operacional para negocios de alimentacao, com estoque, cardapio, compras, financeiro, funcionarios, relatorios e IA para tomada de decisao."

Esse posicionamento justifica preco maior que ferramentas simples de estoque e menor que ERPs completos com fiscal avancado, enquanto o produto amadurece.

### Faixa de preco recomendada

| Plano | Preco mensal | Preco anual sugerido | Perfil |
|---|---:|---:|---|
| Inicial | R$ 0,00 | R$ 0,00 | Validacao e pequenos testes |
| Starter | R$ 69,90/mês | R$ 699,00/ano | Pequeno restaurante ou lanchonete |
| Pro | R$ 169,90/mês | R$ 1.699,00/ano | Operacao ativa com equipe e relatorios |
| Enterprise | R$ 499,90/mês | R$ 4.999,00/ano | Operacao maior, rede pequena ou multiunidade |
| Vitalicio | R$ 12.997,00 pagamento unico | Nao aplicavel | Cliente premium que quer previsibilidade |

Observacao: o preco anual representa desconto aproximado de 16% a 17% sobre 12 mensalidades. E uma pratica comum e facil de comunicar sem criar promessa abusiva.

## 3. Planos e funcionalidades

### 3.1 Plano Inicial - Gratis

Preco: R$ 0,00  
Objetivo: permitir que o cliente teste o produto com uso real limitado.  
Ideal para: negocio em validacao, MEI, pequeno restaurante iniciando controle digital.

Inclui:

- 1 empresa cadastrada.
- 1 usuario administrador.
- Ate 50 produtos ativos.
- Ate 5 categorias de produtos.
- Dashboard basico de estoque.
- Cadastro, edicao e exclusao de produtos.
- Controle de estoque minimo.
- Alertas visuais de estoque baixo.
- Historico basico de movimentacoes.
- Cadastro basico de fornecedores.
- Relatorio simples de estoque em tela.
- Exportacao CSV basica.
- Tema claro/escuro.
- Acesso web responsivo.
- Central de ajuda e FAQ.

Nao inclui:

- Modulo financeiro completo.
- Gestao de funcionarios.
- Cardapio digital.
- Relatorios em PDF/Excel.
- IA com Google Gemini.
- API.
- Multiempresa.
- Logs avancados e auditoria.
- Suporte prioritario.
- Aplicativo Android/APK para uso comercial.

Limites operacionais:

- 50 produtos ativos.
- 100 movimentacoes de estoque por mês.
- 1 exportacao CSV por mês.
- Sem personalizacao de marca.

Uso estrategico:

- Plano gratuito deve ter CTA claro para upgrade quando atingir limite de produtos, movimentacoes, relatorios ou necessidade de IA.
- Evitar "ilimitado" no gratis para nao gerar custo operacional sem receita.

### 3.2 Plano Starter

Preco mensal: R$ 69,90/mês  
Preco anual: R$ 699,00/ano  
Objetivo: plano de entrada pago, competitivo com ERPs de baixo custo.  
Ideal para: pequenos restaurantes, cafeterias, hamburguerias, marmitarias, bares e negocios com ate uma unidade.

Inclui tudo do Inicial, mais:

- 1 empresa.
- Ate 3 usuarios.
- Ate 500 produtos ativos.
- Ate 30 fornecedores.
- Ate 20 categorias.
- Dashboard completo de estoque.
- Cadastro de produtos com custo, preco de venda, unidade, categoria, status e imagem.
- Controle de estoque minimo e maximo.
- Controle de validade de produtos pereciveis.
- Codigo de barras.
- Busca e filtros avancados.
- Historico completo de entradas e saidas.
- Relatorios de estoque por periodo.
- Exportacao CSV e Excel.
- Modulo financeiro basico:
  - receitas;
  - despesas;
  - categorias financeiras;
  - fluxo de caixa simples;
  - resultado por periodo.
- Cadastro de fornecedores com contatos.
- Configuracoes de notificacoes.
- Backup manual solicitado pelo painel.
- Suporte por email em horario comercial.

Nao inclui:

- IA avancada.
- Gestao completa de funcionarios.
- Cardapio digital com ingredientes.
- API publica.
- Multiempresa.
- Relatorios customizados.
- Auditoria avancada.

Limites operacionais:

- 500 produtos ativos.
- 1.000 movimentacoes de estoque por mês.
- 3 usuarios.
- 30 fornecedores.
- 20 exportacoes por mês.
- Suporte com resposta em ate 2 dias uteis.

Motivo do preco:

- Fica acima de ferramentas muito simples, mas ainda competitivo contra ERPs de entrada. O diferencial e ser especializado em alimentacao, estoque perecivel e operacao diaria.

### 3.3 Plano Pro

Preco mensal: R$ 169,90/mês  
Preco anual: R$ 1.699,00/ano  
Objetivo: principal plano comercial, com melhor margem e maior valor percebido.  
Ideal para: negocios com equipe, compras recorrentes, cardapio ativo, necessidade de controle financeiro e decisao por dados.

Inclui tudo do Starter, mais:

- 1 empresa.
- Ate 10 usuarios.
- Ate 2.500 produtos ativos.
- Ate 150 fornecedores.
- Dashboard gerencial completo.
- Modulo financeiro avancado:
  - fluxo de caixa;
  - receitas e despesas;
  - categorias;
  - comparativos historicos;
  - indicadores de margem;
  - lucro/prejuizo por periodo;
  - exportacao financeira.
- Gestao de funcionarios:
  - cadastro de colaboradores;
  - cargos;
  - dados bancarios/PIX;
  - historico de pagamentos;
  - configuracao de salarios por funcao;
  - relatorios de folha operacional.
- Cardapio digital:
  - cadastro de pratos;
  - categorias de cardapio;
  - vinculo com ingredientes do estoque;
  - custo por prato;
  - margem estimada;
  - disponibilidade em tempo real;
  - fotos dos pratos.
- Relatorios avancados:
  - estoque;
  - movimentacoes;
  - financeiro;
  - lucratividade por produto;
  - fornecedores;
  - funcionarios;
  - exportacao PDF, Excel, CSV e JSON.
- IA operacional:
  - analise automatica de estoque;
  - sugestoes de compra;
  - previsao de demanda;
  - identificacao de produtos parados;
  - alertas inteligentes de reposicao;
  - sugestoes de combos e promocoes.
- Chat com assistente de IA para perguntas sobre estoque.
- Logs de atividade por usuario.
- Permissoes por perfil.
- Aplicativo Android/APK liberado para uso operacional.
- Suporte prioritario por email e chat em horario comercial.

Limites operacionais:

- 2.500 produtos ativos.
- 10.000 movimentacoes de estoque por mês.
- 10 usuarios.
- 150 fornecedores.
- 300 analises de IA por mês.
- 100 exportacoes por mês.
- Suporte com resposta em ate 1 dia util.

Motivo do preco:

- O preco fica acima dos planos intermediarios genericos porque inclui IA, cardapio, funcionarios e foco operacional em alimentacao. Ainda fica abaixo de planos avancados de ERPs maiores.

Plano recomendado para destacar na pagina de precos.

### 3.4 Plano Enterprise

Preco mensal: R$ 499,90/mês  
Preco anual: R$ 4.999,00/ano  
Opcao adicional: implantacao assistida a partir de R$ 1.500,00, cobrada uma unica vez.  
Objetivo: atender operacoes maiores, franquias pequenas, redes locais e clientes que exigem governanca.

Inclui tudo do Pro, mais:

- Ate 5 empresas/unidades no mesmo contrato.
- Ate 50 usuarios.
- Ate 15.000 produtos ativos.
- Ate 1.000 fornecedores.
- Visao multiempresa/multiunidade.
- Consolidacao de indicadores por unidade.
- Controle de permissoes avancado por unidade, modulo e perfil.
- Auditoria avancada:
  - logs por usuario;
  - logs por modulo;
  - historico de alteracoes criticas;
  - rastreabilidade de acoes administrativas.
- API para integracoes:
  - chaves de API;
  - controle de acesso;
  - documentacao tecnica;
  - ambiente para integracao com sistemas externos.
- Relatorios customizados.
- Exportacoes avancadas.
- IA avancada:
  - analises preditivas;
  - tendencias de consumo;
  - otimizacao de compras;
  - recomendacoes de reducao de perdas;
  - analise de margem por cardapio/produto.
- Suporte por email, chat e chamada agendada.
- Canal prioritario para incidentes.
- Onboarding assistido.
- Treinamento remoto para equipe.
- Backup operacional assistido.
- Monitoramento de saude do sistema.

Limites operacionais:

- 5 empresas/unidades.
- 50 usuarios.
- 15.000 produtos ativos.
- 1.000 fornecedores.
- 100.000 movimentacoes de estoque por mês.
- 2.000 analises de IA por mês.
- 500 exportacoes por mês.
- API com politica de uso justo.
- Suporte com resposta em ate 8 horas uteis.

Opcionais pagos:

- Unidade extra: R$ 79,90/mês por unidade.
- Pacote adicional de 10 usuarios: R$ 49,90/mês.
- Implantacao presencial: valor sob proposta.
- Relatorio customizado sob demanda: a partir de R$ 600,00.
- Integracao customizada: valor sob proposta.

Motivo do preco:

- O valor fica abaixo dos planos avancados mais caros do mercado, mas captura a complexidade de multiunidade, suporte, auditoria, API e IA.

### 3.5 Plano Vitalicio

Preco: R$ 12.997,00 pagamento unico  
Parcelamento sugerido: ate 12x conforme meio de pagamento, com juros da operadora quando aplicavel.  
Objetivo: oferta premium para clientes que querem previsibilidade e para gerar caixa antecipado.

Importante: para reduzir risco juridico, nao comunicar como "acesso para sempre sem nenhuma condicao". A comunicacao correta deve ser:

> "Pagamento unico para uso por prazo indeterminado do GestaoZe, enquanto a plataforma SaaS estiver em operacao comercial, sujeito aos Termos de Uso, Politica de Uso Justo e custos variaveis de terceiros."

Inclui:

- Tudo do Enterprise.
- Ate 10 empresas/unidades.
- Ate 100 usuarios.
- Ate 30.000 produtos ativos.
- Ate 2.000 fornecedores.
- 5.000 analises de IA por mês.
- API com prioridade maior.
- Onboarding assistido incluso.
- 2 treinamentos remotos inclusos.
- 2 relatorios customizados inclusos.
- Prioridade em roadmap quando houver aderencia ao produto.
- Suporte premium por email, chat e chamada agendada.
- Revisao trimestral de uso no primeiro ano.
- Condicao comercial sem mensalidade recorrente da plataforma.

Nao inclui automaticamente:

- Custos de servicos de terceiros, quando houver cobranca externa separada.
- Impostos, taxas de pagamento, tarifas bancarias, SMS, WhatsApp, emissao fiscal, gateways, APIs externas ou servicos que tenham custo variavel fora do GestaoZe.
- Desenvolvimento sob medida ilimitado.
- Garantia de manutencao eterna da marca, infraestrutura ou versao atual.
- Servicos presenciais.

Limites operacionais:

- 10 empresas/unidades.
- 100 usuarios.
- 30.000 produtos ativos.
- 2.000 fornecedores.
- 300.000 movimentacoes de estoque por mês.
- 5.000 analises de IA por mês.
- 1.000 exportacoes por mês.
- API com politica de uso justo.
- Suporte com resposta em ate 4 horas uteis.

Regras recomendadas:

- Vender em quantidade limitada por lote, por exemplo "20 licencas vitalicias no primeiro lote".
- Contrato individual obrigatorio.
- Informar claramente politica de uso justo.
- Prever migracao de plano se o cliente ultrapassar limites operacionais por 3 meses consecutivos.
- Prever que funcionalidades futuras muito custosas podem ser cobradas como add-on.

Motivo do preco:

- O valor equivale a cerca de 26 meses do Enterprise mensal ou 76 meses do Pro mensal. E alto o suficiente para nao prejudicar receita recorrente e atrativo para empresas que querem previsibilidade.

## 4. Matriz comparativa

| Recurso | Inicial | Starter | Pro | Enterprise | Vitalicio |
|---|---:|---:|---:|---:|---:|
| Preco mensal | R$ 0 | R$ 69,90 | R$ 169,90 | R$ 499,90 | R$ 0 apos pagamento unico |
| Preco anual | R$ 0 | R$ 699 | R$ 1.699 | R$ 4.999 | R$ 12.997 unico |
| Empresas/unidades | 1 | 1 | 1 | 5 | 10 |
| Usuarios | 1 | 3 | 10 | 50 | 100 |
| Produtos ativos | 50 | 500 | 2.500 | 15.000 | 30.000 |
| Fornecedores | Basico | 30 | 150 | 1.000 | 2.000 |
| Movimentacoes/mês | 100 | 1.000 | 10.000 | 100.000 | 300.000 |
| Dashboard de estoque | Basico | Completo | Gerencial | Multiunidade | Multiunidade |
| Alertas de estoque baixo | Sim | Sim | Sim | Sim | Sim |
| Controle de validade | Nao | Sim | Sim | Sim | Sim |
| Codigo de barras | Nao | Sim | Sim | Sim | Sim |
| Financeiro | Nao | Basico | Avancado | Avancado multiunidade | Avancado multiunidade |
| Funcionarios | Nao | Nao | Sim | Sim | Sim |
| Cardapio digital | Nao | Nao | Sim | Sim | Sim |
| Custo por prato | Nao | Nao | Sim | Sim | Sim |
| Relatorios PDF/Excel | Nao | Parcial | Sim | Sim | Sim |
| Exportacao JSON | Nao | Nao | Sim | Sim | Sim |
| IA | Nao | Nao | 300 analises/mês | 2.000 analises/mês | 5.000 analises/mês |
| Chat com IA | Nao | Nao | Sim | Sim | Sim |
| Logs de usuario | Nao | Basico | Sim | Avancado | Avancado |
| Auditoria | Nao | Nao | Basica | Avancada | Avancada |
| Permissoes por perfil | Nao | Basico | Sim | Avancado | Avancado |
| API | Nao | Nao | Nao | Sim | Sim |
| Multiempresa | Nao | Nao | Nao | Sim | Sim |
| App Android/APK | Nao | Nao | Sim | Sim | Sim |
| Suporte | FAQ | Email | Email + chat | Prioritario | Premium |
| Onboarding | Autoatendimento | Autoatendimento | Guiado por material | Assistido | Assistido incluso |

## 5. Funcionalidades por modulo

### Estoque

- Cadastro de produtos.
- Categorias.
- Unidade de medida.
- Estoque atual, minimo e maximo.
- Status ativo/inativo.
- Controle de custo e preco de venda.
- Movimentacoes de entrada e saida.
- Historico de movimentacoes.
- Alertas de estoque baixo.
- Controle de validade.
- Codigo de barras.
- Imagens de produtos.
- Relatorios de estoque.

### Financeiro

- Receitas.
- Despesas.
- Categorias financeiras.
- Resultado por periodo.
- Fluxo de caixa.
- Indicadores de margem.
- Comparativos historicos.
- Exportacao financeira.
- Relatorios gerenciais.

### Funcionarios

- Cadastro de colaboradores.
- Dados bancarios e PIX.
- Controle de pagamentos.
- Historico de pagamentos.
- Configuracao de salarios por cargo.
- Relatorios de folha operacional.
- Controle de faltas/presenca quando habilitado.

### Fornecedores

- Cadastro completo.
- Contatos.
- Historico de compras.
- Avaliacao de fornecedor.
- Documentos e informacoes fiscais.
- Prazos e condicoes comerciais.

### Cardapio

- Cadastro de pratos.
- Categorias.
- Ingredientes vinculados ao estoque.
- Custo estimado por prato.
- Margem estimada.
- Fotos.
- Disponibilidade.
- Planejamento de producao/cardapio.

### Relatorios e analytics

- Estoque.
- Movimentacoes.
- Financeiro.
- Produtos mais vendidos.
- Produtos parados.
- Lucratividade por produto.
- Fornecedores.
- Funcionarios.
- Exportacao PDF, Excel, CSV e JSON conforme plano.

### IA

- Analise de estoque.
- Sugestao de compra.
- Previsao de demanda.
- Identificacao de desperdicio ou baixa rotatividade.
- Otimizacao de margem.
- Sugestao de combos/promocoes.
- Chat operacional com contexto de estoque.

### Administracao SaaS

- Multi-tenancy.
- Empresas/tenants.
- Usuarios por empresa.
- Planos de assinatura.
- Historico de assinatura.
- Registro de leads.
- Contato comercial.
- FAQ.
- Termos legais.
- Politica de privacidade.
- Cookies.

## 6. Regras comerciais recomendadas

### Teste gratis

Recomendacao: 14 dias gratis nos planos pagos, sem exigir cartao de credito.

Motivo:

- Ja esta previsto na documentacao atual do projeto.
- Reduz friccao de entrada.
- Evita discussoes de reembolso logo no primeiro contato.

### Desconto anual

Recomendacao:

- Starter: R$ 699/ano.
- Pro: R$ 1.699/ano.
- Enterprise: R$ 4.999/ano.

Comunicar como "economize aproximadamente 2 mensalidades".

### Upgrade e downgrade

Politica sugerida:

- Upgrade imediato com cobranca proporcional no ciclo atual.
- Downgrade aplicado no proximo ciclo.
- Dados acima do limite do novo plano ficam preservados, mas novas criacoes ficam bloqueadas ate adequacao.

### Cancelamento

Politica sugerida:

- Cancelamento a qualquer momento.
- Acesso mantido ate o fim do periodo pago.
- Exportacao dos dados disponivel por 30 dias apos cancelamento.
- Exclusao definitiva conforme Politica de Privacidade e LGPD, respeitando obrigacoes legais.

### Reembolso

Politica sugerida:

- Planos mensais: sem reembolso proporcional apos inicio do ciclo, exceto obrigacoes legais ou falha comprovada do servico.
- Planos anuais: possibilidade de reembolso proporcional dentro de 7 dias da compra online, quando aplicavel ao caso concreto.
- Vitalicio: contrato proprio com condicoes claras de arrependimento, suporte e uso justo.

## 7. Analise de conformidade e riscos

Esta secao nao substitui revisao juridica, mas reduz riscos comerciais e de comunicacao.

### LGPD

Pontos obrigatorios para SaaS:

- Informar quais dados pessoais sao coletados.
- Informar finalidade do tratamento.
- Informar base legal aplicavel.
- Ter Politica de Privacidade clara.
- Permitir acesso, correcao e exclusao de dados quando aplicavel.
- Definir papel do GestaoZe como controlador ou operador conforme o contexto.
- Proteger dados por tenant.
- Manter logs de acesso a dados criticos.
- Ter canal para solicitacoes de titulares.
- Evitar usar dados dos clientes para treinar IA sem autorizacao contratual expressa.

Risco especifico de IA:

- Nao prometer decisao automatica perfeita.
- Informar que recomendacoes de IA sao apoio a decisao.
- Evitar enviar dados sensiveis ou desnecessarios para provedores externos.
- Documentar que o Google Gemini/API externa pode processar informacoes conforme configuracao contratual.

### Codigo de Defesa do Consumidor e oferta comercial

Cuidados:

- Preco deve ser claro.
- Periodicidade deve ser clara: mensal, anual ou pagamento unico.
- Recursos e limites devem estar visiveis antes da contratacao.
- Nao usar publicidade enganosa, como "ilimitado" quando ha politica de uso justo.
- Informar eventuais custos extras.
- Informar condicoes de cancelamento.
- Informar se valores podem mudar em renovacao.
- Nao ocultar limitacoes relevantes do plano gratis.

### Termo "vitalicio"

Risco:

- "Vitalicio" pode ser interpretado como promessa sem prazo e sem condicoes. Isso pode gerar conflito se a empresa mudar infraestrutura, encerrar produto, vender a operacao ou precisar limitar uso abusivo.

Recomendacao:

- Usar "Plano Vitalicio" como nome comercial, mas explicar no contrato:
  - acesso por prazo indeterminado enquanto a plataforma estiver em operacao comercial;
  - sujeito aos Termos de Uso;
  - sujeito a politica de uso justo;
  - custos externos nao incluidos;
  - suporte e evolucao com escopo definido;
  - possibilidade de migracao se houver uso fora do perfil contratado.

### Promessas que devem ser evitadas

Evitar:

- "100% seguro".
- "Nunca perde dados".
- "IA sempre acerta".
- "Suporte 24/7" se nao houver equipe real 24 horas por dia.
- "Usuarios ilimitados" sem politica de uso justo.
- "Armazenamento ilimitado".
- "Vitalicio para sempre sem restricoes".
- "Garantia de lucro".
- "Substitui contador".

Usar no lugar:

- "Seguranca com boas praticas e isolamento por empresa".
- "Rotinas de backup e recuperacao conforme plano".
- "IA para apoio a decisao".
- "Suporte em horario comercial" ou "suporte prioritario com SLA".
- "Uso justo conforme limites do plano".
- "Acesso por prazo indeterminado enquanto a plataforma estiver em operacao comercial".

### Fiscal e contabilidade

O projeto atual tem financeiro, estoque e relatórios, mas nao deve prometer emissao fiscal completa se isso nao estiver implementado e homologado.

Texto recomendado:

> "O GestaoZe oferece controle gerencial de estoque, financeiro, equipe, fornecedores e relatorios. Funcionalidades fiscais, emissao de documentos oficiais, integracoes bancarias ou contabeis podem depender de modulos especificos, terceiros, certificado digital, regras municipais/estaduais e contratacao adicional."

## 8. Recomendacao de pagina de precos

### Ordem dos planos

Na pagina publica, exibir:

1. Inicial
2. Starter
3. Pro, marcado como "Mais recomendado"
4. Enterprise
5. Vitalicio, como oferta especial ou lote limitado

### Destaque comercial

Plano mais importante: Pro.

Motivo:

- Melhor equilibrio entre valor e preco.
- Usa recursos fortes do produto: IA, financeiro, funcionarios, cardapio e relatorios.
- Deve ser a principal meta de conversao.

### CTA recomendado

- Inicial: "Comecar gratis"
- Starter: "Assinar Starter"
- Pro: "Comecar teste Pro"
- Enterprise: "Falar com especialista"
- Vitalicio: "Solicitar contrato vitalicio"

## 9. Copy comercial sugerida

### Headline

Gestao de estoque, equipe e financeiro para negocios de alimentacao que precisam decidir com dados.

### Subheadline

Controle produtos, fornecedores, cardapio, custos, pagamentos e relatorios em uma plataforma SaaS com IA para apoiar compras, reduzir perdas e melhorar margem.

### Frases por plano

Inicial:

> Para testar o controle de estoque sem custo.

Starter:

> Para pequenos negocios que precisam sair da planilha e controlar estoque com seguranca.

Pro:

> Para operacoes que querem estoque, financeiro, equipe, cardapio, relatorios e IA no mesmo lugar.

Enterprise:

> Para redes e operacoes multiunidade que precisam de governanca, API, auditoria e suporte prioritario.

Vitalicio:

> Para empresas que querem previsibilidade comercial com pagamento unico e acesso por prazo indeterminado conforme contrato.

## 10. Proximos passos tecnicos

Para transformar a proposta em SaaS real dentro do projeto:

1. Atualizar a tabela `subscription_plans` com os 5 planos.
2. Remover dos planos qualquer referencia a armazenamento em GB.
3. Atualizar `PricingView.vue` para exibir os 5 planos.
4. Criar controle de limites por plano:
   - usuarios;
   - produtos ativos;
   - fornecedores;
   - movimentacoes mensais;
   - analises de IA;
   - exportacoes;
   - unidades/empresas.
5. Bloquear criacao acima do limite com mensagem de upgrade.
6. Integrar meio de pagamento recorrente.
7. Adicionar painel administrativo para assinatura.
8. Revisar Termos de Uso, Politica de Privacidade, Cookies e LGPD.
9. Criar rotina de exportacao de dados para cancelamento.
10. Implementar trilha de auditoria para acoes criticas.

## 11. Conclusao

A melhor estrategia e usar o plano Inicial para aquisicao, Starter como entrada paga, Pro como principal plano de receita, Enterprise para operacoes multiunidade e Vitalicio como oferta premium limitada.

Os precos sugeridos ficam coerentes com o mercado brasileiro atual de ERP/estoque, considerando que concorrentes de entrada aparecem perto de R$ 55/mês, intermediarios perto de R$ 120/mês e avancados perto de R$ 650/mês ou valor personalizado. O GestaoZe deve cobrar pela especializacao em alimentacao, IA, cardapio, funcionarios, multi-tenancy, auditoria e suporte, evitando diferenciar planos por armazenamento em GB.
