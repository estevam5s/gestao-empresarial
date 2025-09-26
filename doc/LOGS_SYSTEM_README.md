# 🚀 Sistema Avançado de Logs - GestaoZe

Sistema profissional de logs com interface moderna, terminal de comandos, relatórios técnicos e monitoramento em tempo real.

## 📋 Características

### ✨ Interface Elegante
- **Design Moderno**: Interface dark com gradientes e animações
- **Terminal Integrado**: Terminal de comandos administrativos completo
- **Dashboard em Tempo Real**: Métricas e estatísticas ao vivo
- **Tabela Profissional**: Visualização detalhada com filtros avançados
- **Modais Interativos**: Detalhes expandidos e relatórios

### ⌨️ Sistema de Comandos Avançados
```bash
help                          # Lista todos os comandos disponíveis
stats --days 30              # Estatísticas dos últimos 30 dias
logs --limit 50 --severity error    # Últimos 50 logs de erro
users                        # Lista usuários ativos
status                       # Status atual do sistema
export --format pdf --days 7 # Exporta relatório em PDF
search --query "login"       # Busca nos logs
monitor --category security  # Monitor em tempo real
clear                        # Limpa o terminal
backup                       # Inicia backup de logs
```

### 📊 Relatórios Profissionais
- **Templates Múltiplos**: Executivo, Técnico, Segurança, Performance, Auditoria
- **Formatos Diversos**: PDF, Excel, HTML, JSON
- **Análise Avançada**: Métricas, tendências, recomendações
- **Linguagem Técnica**: Terminologia profissional especializada

### 🔍 Monitoramento Inteligente
- **Interceptação Automática**: Captura todas as ações do administrador
- **Alertas de Segurança**: Detecção de atividades suspeitas
- **Monitoramento de Performance**: Análise de tempo de resposta
- **Limpeza Automática**: Gerenciamento inteligente de espaço

## 🛠️ Instalação e Configuração

### 1. Dependências
```bash
npm install jspdf jspdf-autotable xlsx
```

### 2. Configuração do Banco de Dados
```sql
CREATE TABLE logs (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  severity TEXT CHECK (severity IN ('info', 'warning', 'error', 'critical', 'debug')) DEFAULT 'info',
  category TEXT CHECK (category IN ('auth', 'crud', 'system', 'security', 'performance', 'user', 'api', 'database', 'command')) DEFAULT 'system',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  execution_time INTEGER,
  status TEXT CHECK (status IN ('success', 'failed', 'pending')) DEFAULT 'success',
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Índices para performance
CREATE INDEX idx_logs_timestamp ON logs(timestamp DESC);
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_category ON logs(category);
CREATE INDEX idx_logs_severity ON logs(severity);
CREATE INDEX idx_logs_status ON logs(status);
CREATE INDEX idx_logs_resource ON logs(resource);
```

### 3. Inicialização no main.ts
```typescript
import { createApp } from 'vue'
import App from './App.vue'
import logInterceptorPlugin from '@/plugins/logInterceptor'
import { initializeLogsSystem } from '@/setup/initializeLogsSystem'

const app = createApp(App)

// Instalar plugin de logs
app.use(logInterceptorPlugin)

// Inicializar sistema após montagem
app.mount('#app')

// Inicializar sistema de logs
initializeLogsSystem({
  enableInterceptors: true,
  enableAutoCleanup: true,
  cleanupIntervalDays: 90,
  enablePerformanceMonitoring: true,
  enableSecurityAlerts: true,
  testSystem: false,
  createSampleData: false
})
```

### 4. Configuração da Rota
```typescript
// router/index.ts
import LogsView from '@/views/LogsView.vue'

const routes = [
  {
    path: '/logs',
    name: 'Logs',
    component: LogsView,
    meta: { requiresAuth: true, roles: ['admin'] }
  }
]
```

## 📁 Estrutura de Arquivos

```
src/
├── views/
│   └── LogsView.vue                 # Interface principal
├── services/
│   ├── logService.ts               # Serviço core de logs
│   └── reportService.ts            # Geração de relatórios
├── middleware/
│   └── logInterceptor.ts           # Interceptação automática
├── plugins/
│   └── logInterceptor.ts           # Plugin Vue
├── setup/
│   └── initializeLogsSystem.ts     # Inicialização automática
├── styles/
│   └── logs-advanced.css           # Estilos profissionais
└── tests/
    └── logsSystem.test.ts          # Testes abrangentes
```

## 🎨 Interface do Usuário

### Dashboard Principal
- **Header Elegante**: Com gradientes e animações
- **Terminal Interativo**: Com histórico e autocompletar
- **Cards de Métricas**: Problemas críticos, taxa de erro, tempo médio
- **Filtros Avançados**: Por categoria, severidade, data, busca

### Terminal de Comandos
- **Prompt Realista**: `admin@gestaeze:~$`
- **Histórico**: Navegação com setas ↑/↓
- **Autocompletar**: Tab para completar comandos
- **Saída Colorida**: Verde para sucesso, vermelho para erro

### Tabela de Logs
- **Colunas Profissionais**: Timestamp, Categoria, Severidade, Ação, etc.
- **Badges Coloridos**: Visual distinção por severidade
- **Modal de Detalhes**: Visualização expandida de logs específicos
- **Paginação Avançada**: Controles completos de navegação

## 📊 Comandos do Terminal

### Comandos Básicos
```bash
# Ajuda
help

# Estatísticas
stats                         # Últimos 30 dias
stats --days 7               # Últimos 7 dias

# Visualizar logs
logs                          # Últimos 10 logs
logs --limit 50              # Últimos 50 logs
logs --severity error        # Apenas logs de erro
logs --limit 20 --severity warning  # 20 logs de aviso
```

### Comandos Avançados
```bash
# Busca
search --query "database"    # Busca por "database"
search --query "login failed"  # Busca por falhas de login

# Usuários
users                        # Lista usuários ativos

# Status do sistema
status                       # Status atual completo

# Exportação
export --format json         # Exporta em JSON
export --format csv --days 30  # CSV dos últimos 30 dias

# Monitoramento
monitor                      # Monitor geral
monitor --category security  # Monitor de segurança

# Manutenção
backup                       # Backup de logs
clear                        # Limpa terminal
```

## 📈 Relatórios Técnicos

### Templates Disponíveis

#### 1. Executivo
- **Foco**: Tomada de decisões estratégicas
- **Conteúdo**: Métricas principais, tendências, recomendações
- **Público**: Direção, gerência

#### 2. Técnico Detalhado
- **Foco**: Análise técnica profunda
- **Conteúdo**: Performance, erros, logs detalhados
- **Público**: Desenvolvedores, administradores

#### 3. Segurança
- **Foco**: Análise de segurança e conformidade
- **Conteúdo**: Incidentes, autenticação, controle de acesso
- **Público**: Equipe de segurança, auditores

#### 4. Performance
- **Foco**: Otimização e performance
- **Conteúdo**: Tempos de resposta, gargalos, otimizações
- **Público**: Engenheiros de performance

#### 5. Auditoria
- **Foco**: Compliance e auditoria
- **Conteúdo**: Todos os logs, trilha completa
- **Público**: Auditores, compliance

### Formatos de Exportação
- **PDF**: Relatório formatado e profissional
- **Excel**: Planilhas com múltiplas abas e gráficos
- **HTML**: Relatório web interativo
- **JSON**: Dados estruturados para integração

## 🔧 Configurações Avançadas

### Interceptação Automática
```typescript
// Ativar/desativar interceptação
logInterceptor.setEnabled(true)

// Log manual de ações
logInterceptor.logUserAction('custom_action', 'resource', { data: 'example' })

// Log de erros
logInterceptor.logError(new Error('Test'), 'context', { additional: 'info' })

// Log de autenticação
logInterceptor.logAuth('login_success', { username: 'admin' }, true)

// Log de segurança
logInterceptor.logSecurity('suspicious_activity', { ip: '1.2.3.4' }, 'warning')
```

### Limpeza Automática
```typescript
// Configurar limpeza automática (90 dias)
const initializer = new LogsSystemInitializer({
  enableAutoCleanup: true,
  cleanupIntervalDays: 90
})

// Limpeza manual
await logService.cleanOldLogs(30) // Remove logs > 30 dias
```

### Monitoramento de Performance
```typescript
// Configurar alertas de performance
const initializer = new LogsSystemInitializer({
  enablePerformanceMonitoring: true
})

// Logs automáticos de performance de página
// Alertas para tempo de carregamento > 3s
// Monitoramento de uso de memória
```

## 🧪 Testes

### Executar Testes
```typescript
import { runLogsSystemTests, runQuickTest } from '@/tests/logsSystem.test'

// Teste completo
await runLogsSystemTests()

// Teste rápido
const isWorking = await runQuickTest()
```

### Cobertura de Testes
- ✅ Criação e busca de logs
- ✅ Sistema de comandos completo
- ✅ Geração de relatórios
- ✅ Interceptação automática
- ✅ Performance do sistema
- ✅ Cenários reais de uso

## 🔒 Segurança

### Recursos de Segurança
- **Sanitização**: Dados sensíveis são automaticamente ocultados
- **Alertas Automáticos**: Detecção de atividades suspeitas
- **Monitoramento**: Tentativas de login, IPs suspeitos
- **Auditoria Completa**: Trilha de todas as ações administrativas

### Dados Sanitizados
- Senhas e tokens são automaticamente ocultados
- Informações sensíveis marcadas como `[SANITIZED]`
- Headers de autenticação protegidos
- Dados de resposta limitados em tamanho

## 📱 Responsividade

### Dispositivos Suportados
- **Desktop**: Experiência completa
- **Tablet**: Interface adaptada
- **Mobile**: Funcionalidade essencial

### Adaptações Mobile
- Terminal simplificado
- Tabela com scroll horizontal
- Modais em tela cheia
- Paginação simplificada

## 🚀 Performance

### Otimizações
- **Paginação Inteligente**: Carregamento sob demanda
- **Índices de Banco**: Consultas otimizadas
- **Cache Local**: Dados em localStorage quando offline
- **Debounce**: Busca com delay para evitar spam

### Métricas de Performance
- Inserção de logs: < 100ms
- Busca paginada: < 500ms
- Geração de relatórios: < 3s
- Estatísticas: < 1s

## 🔧 Manutenção

### Rotinas Recomendadas
1. **Limpeza Mensal**: Remover logs > 90 dias
2. **Backup Semanal**: Exportar dados importantes
3. **Análise Mensal**: Revisar relatórios de segurança
4. **Otimização Trimestral**: Revisar índices do banco

### Comandos de Manutenção
```bash
# Via terminal da interface
backup                       # Backup imediato
stats --days 90             # Análise trimestral
export --format excel --days 90  # Relatório completo

# Via código
await logService.cleanOldLogs(90)
await reportService.generateReport(config)
```

## 🆘 Troubleshooting

### Problemas Comuns

#### Logs não aparecem
1. Verificar conexão com Supabase
2. Conferir permissões da tabela `logs`
3. Verificar se interceptação está ativa

#### Terminal não funciona
1. Verificar se logService está inicializado
2. Conferir erros no console do navegador
3. Testar com comando `help`

#### Relatórios falham
1. Verificar dependências (jsPDF, xlsx)
2. Confirmar dados disponíveis no período
3. Testar com período menor

#### Performance lenta
1. Verificar índices do banco de dados
2. Reduzir limite de logs por página
3. Implementar cache se necessário

### Logs de Debug
```typescript
// Ativar logs de debug
localStorage.setItem('logs_debug', 'true')

// Verificar status
const status = await logsSystemInitializer.getSystemStatus()
console.log(status)
```

## 📞 Suporte

### Documentação
- **Interface**: Tooltips e ajuda contextual
- **Comandos**: `help` no terminal
- **Códigos**: Comentários detalhados no código

### Desenvolvimento
- **Testes**: Sistema de testes abrangente
- **Logs**: Sistema auto-documentado
- **Exemplos**: Dados de exemplo incluídos

---

## 🎉 Conclusão

O Sistema Avançado de Logs do GestaoZe oferece:

✅ **Interface Profissional** com design moderno e responsivo
✅ **Terminal Completo** com comandos avançados e autocompletar
✅ **Relatórios Técnicos** em múltiplos formatos e templates
✅ **Monitoramento Automático** de todas as ações administrativas
✅ **Segurança Integrada** com alertas e sanitização
✅ **Performance Otimizada** para grandes volumes de dados
✅ **Manutenção Automática** com limpeza e backup
✅ **Testes Abrangentes** para garantir qualidade

O sistema está pronto para uso em produção e oferece todas as funcionalidades necessárias para um monitoramento profissional e completo do sistema GestaoZe.

---

**Desenvolvido com ❤️ para o GestaoZe - Sistema de Gestão de Estoque Avançado**