# Painel Administrativo (Admin SaaS) - Especificação Completa

## 1. Controle de Acesso Administrativo

### Usuário Administrador Inicial

Criar um usuário administrador principal com acesso total à plataforma:

* Login: [contato@estevamsouza.com.br](mailto:contato@estevamsouza.com.br)
* Senha: Respira@110088

### Regras de Segurança

* O painel administrativo deve possuir rotas exclusivas.
* Usuários comuns não podem acessar nenhuma rota administrativa.
* Implementar controle de permissões (RBAC).
* Todas as rotas administrativas devem possuir validação de autenticação e autorização.

---

# 2. Dashboard Executivo

O dashboard principal do administrador deve apresentar métricas em tempo real:

### Receita

* MRR (Monthly Recurring Revenue)
* ARR (Annual Recurring Revenue)
* ARPU (Average Revenue Per User)
* LTV (Lifetime Value)
* Conversão
* Churn Rate

### Clientes

* Total de usuários
* Usuários ativos
* Usuários em teste
* Usuários pagantes
* Usuários cancelados
* Novos usuários por período
* Crescimento mensal

### Visualização

* Gráficos avançados
* Tabelas detalhadas
* Comparativos por período
* Filtros por data
* Exportação de relatórios

---

# 3. Gestão Completa de Usuários e Clientes

Criar uma rota administrativa para gerenciamento completo dos usuários.

## Funcionalidades

### Gestão de Contas

* Visualizar todos os usuários
* Pesquisar usuários
* Filtrar usuários
* Editar dados
* Impersonação/Login como usuário
* Bloquear usuário
* Suspender usuário
* Reativar usuário

### Exclusão Definitiva

Ao remover um usuário:

* Todos os dados devem ser removidos permanentemente.
* O e-mail deve ser liberado para novo cadastro.
* Não deve existir bloqueio futuro para reutilização do e-mail.

### Assinaturas

* Visualizar assinatura atual
* Alterar plano
* Cancelar assinatura
* Reativar assinatura
* Histórico de pagamentos
* Histórico de alterações

### Satisfação e Suporte

* Histórico de chamados
* Avaliações dos clientes
* NPS (opcional)
* Feedbacks recebidos

---

# 4. Gestão de Planos e Assinaturas

Criar uma área completa para gerenciamento dos planos.

## Funcionalidades

### Planos

* Criar plano
* Editar plano
* Excluir plano
* Ativar/Inativar plano

### Recursos dos Planos

* Definir funcionalidades liberadas
* Definir limites de uso
* Definir quotas

### Stripe

Integração completa com Stripe:

* Atualização automática de preços
* Webhooks configurados
* Sincronização de assinaturas
* Sincronização de cancelamentos
* Sincronização de upgrades e downgrades

---

# 5. Controle de Recursos por Plano

Criar uma área onde o administrador consiga visualizar exatamente quais funcionalidades estão disponíveis para cada plano.

## Funcionalidades

* Recursos liberados por plano
* Recursos bloqueados por plano
* Controle de limites
* Controle de uso por usuário
* Verificação de inconsistências

---

# 6. Promoções, Ofertas e Cupons

Criar uma rota exclusiva para promoções.

## Funcionalidades

### Cupons

* Criar cupom
* Editar cupom
* Excluir cupom
* Ativar/Inativar cupom

### Tipos de Desconto

* Valor fixo
* Porcentagem
* Desconto recorrente
* Desconto único

### Ofertas

* Ofertas por tempo limitado
* Contador regressivo
* Landing pages promocionais
* Destaque automático no site

### Stripe

* Integração completa com Stripe Coupons
* Integração completa com Stripe Promotion Codes
* Sincronização via Webhooks

### Sugestão Inicial

* 10% OFF (Primeira compra)
* 20% OFF (Plano anual)
* 30% OFF (Black Friday)
* Teste grátis por 14 dias

---

# 7. Sistema de Visitantes e Analytics

Criar uma área avançada de visitantes.

## Funcionalidades

### Mapa Global

* Globo interativo mundial
* Visitantes em tempo real
* Localização por país
* Localização por cidade
* Heatmaps

### Estatísticas

* Total de visitantes
* Visitantes únicos
* Origem do tráfego
* Dispositivos
* Navegadores
* Conversões

---

# 8. Monitoramento da Saúde do SaaS

Criar uma área semelhante ao modelo apresentado no arquivo:

"Captura de Tela 2026-06-16 às 13.14.58.png"

## Funcionalidades

### Infraestrutura

* Status do banco de dados
* Status do Supabase
* Status das APIs
* Status dos Webhooks
* Status da Stripe

### Performance

* Tempo de resposta
* Consumo de recursos
* Uptime
* Latência

### Alertas

* Alertas automáticos
* Incidentes
* Histórico de falhas

---

# 9. Sistema de Logs e Auditoria

Criar uma rota exclusiva de Logs.

## Logs do Sistema

* Erros internos
* Exceções
* Falhas de integração
* Eventos críticos

## Logs dos Usuários

* Login
* Logout
* Alterações de perfil
* Assinaturas
* Cancelamentos

## Segurança

Registrar tentativas de:

* Bruteforce
* Ataques automatizados
* Tentativas inválidas de login
* Acessos suspeitos

## Frontend

Capturar:

* Erros JavaScript
* Erros de Console
* Erros de Navegador
* Falhas de requisições

---

# 10. Sistema de Backup e Recuperação

Criar uma área completa de backup.

## Backup

* Backup semanal automático
* Backup manual
* Backup incremental
* Backup completo

## Dados Incluídos

* Usuários
* Assinaturas
* Planos
* Configurações
* Dados sensíveis
* Logs
* Configurações gerais do sistema

## Exportação

Gerar arquivos para:

* Backup completo
* Migração de plataforma
* Recuperação de desastre

## Importação

Permitir:

* Upload de arquivo de backup
* Restauração completa
* Restauração parcial

### Objetivo

Garantir recuperação total da plataforma caso:

* Supabase fique indisponível
* Conta seja suspensa
* Banco de dados seja corrompido

---

# 11. SEO e Marketing

Criar uma área administrativa completa para SEO.

## SEO Global

* Meta Title
* Meta Description
* Keywords
* Open Graph
* Twitter Cards

## Sitemap

* Gerar Sitemap automático
* Atualização automática

## Robots

* Configuração de robots.txt

## Google

* Integração com Google Search Console
* Integração com Google Analytics
* Integração com Google Tag Manager

## Monitoramento

* Indexação
* Palavras-chave
* Performance de páginas

---

# 12. API Administrativa

Criar uma API exclusiva do painel administrativo.

## Objetivo

Permitir que outros sistemas SaaS de gestão tenham acesso às informações da plataforma.

## Recursos

* API Keys
* Controle de permissões
* Rate Limiting
* Logs de uso
* Webhooks

## Dados Disponíveis

* Usuários
* Assinaturas
* MRR
* ARR
* ARPU
* LTV
* Conversão
* Churn
* Planos
* Cupons
* Visitantes
* Logs
* Saúde do sistema

---

# 13. Sidebar Administrativa

Estrutura sugerida:

* Dashboard
* Usuários
* Assinaturas
* Planos
* Recursos por Plano
* Promoções
* Cupons
* Visitantes
* Analytics
* Saúde do SaaS
* SEO
* API
* Backups
* Logs
* Configurações

---

# Objetivo Final

Construir um painel administrativo enterprise-grade, centralizando toda a operação do SaaS em um único local, permitindo monitoramento, gestão financeira, gestão de usuários, marketing, segurança, infraestrutura, backups, integrações e crescimento da plataforma.
