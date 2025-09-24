import axios from 'axios'

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

export class AIService {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY
    this.apiUrl = import.meta.env.VITE_GEMINI_API_URL

    if (!this.apiKey) {
      console.error('API key do Google Gemini não configurada')
    }
    if (!this.apiUrl) {
      console.error('URL da API do Google Gemini não configurada')
    }
  }

  private async makeGeminiRequest(prompt: string): Promise<string> {
    if (!this.apiKey || !this.apiUrl) {
      throw new Error('Configuração da API do Google Gemini não encontrada. Verifique as variáveis de ambiente.')
    }

    try {
      console.log('🤖 Enviando solicitação para Google Gemini...')

      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 seconds timeout
        }
      )

      console.log('✅ Resposta recebida do Google Gemini')

      const geminiResponse: GeminiResponse = response.data

      if (!geminiResponse.candidates || geminiResponse.candidates.length === 0) {
        throw new Error('Nenhuma resposta válida foi gerada pela IA')
      }

      const aiText = geminiResponse.candidates[0]?.content?.parts[0]?.text
      if (!aiText) {
        throw new Error('Resposta da IA está vazia ou inválida')
      }

      return aiText
    } catch (error: any) {
      console.error('❌ Erro ao processar com IA:', error)

      if (error.response) {
        // Error from API
        const status = error.response.status
        const data = error.response.data

        console.error('Status:', status)
        console.error('Data:', data)

        if (status === 403) {
          throw new Error('🔒 Acesso negado à API. Verifique se a chave da API está correta e tem as permissões necessárias.')
        } else if (status === 429) {
          throw new Error('⏱️ Limite de uso da API excedido. Tente novamente em alguns minutos.')
        } else if (status === 400) {
          throw new Error('📝 Solicitação inválida. Os dados enviados podem estar mal formatados.')
        } else if (status >= 500) {
          throw new Error('🔧 Erro interno do servidor da IA. Tente novamente em alguns minutos.')
        } else {
          throw new Error(`❌ Erro da API (${status}): ${data?.error?.message || 'Erro desconhecido'}`)
        }
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('⏰ Tempo limite excedido. A análise está demorando muito para ser concluída.')
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('🌐 Não foi possível conectar com o serviço de IA. Verifique sua conexão com a internet.')
      } else {
        throw new Error('🤖 Erro inesperado ao processar com IA. Tente novamente.')
      }
    }
  }

  async analyzeInventory(inventoryData: any): Promise<string> {
    const prompt = `
Você é um consultor sênior especializado em otimização de estoque para estabelecimentos alimentícios, com 15+ anos de experiência em análise de dados e gestão estratégica.

DADOS DO INVENTÁRIO:
${JSON.stringify(inventoryData, null, 2)}

ANÁLISE EXECUTIVA SOLICITADA:

## 1. 🎯 SITUAÇÃO ESTRATÉGICA DO ESTOQUE
- **Status atual**: Análise crítica dos níveis de estoque vs demanda
- **Valor imobilizado**: R$ ${inventoryData.totalValue?.toFixed(2)} - análise de eficiência do capital
- **Produtos críticos**: Identificação de riscos operacionais iminentes
- **Oportunidades**: Produtos subutilizados com potencial de crescimento

## 2. 🚨 ALERTAS PRIORITÁRIOS & AÇÕES IMEDIATAS
- **URGENTE (Próximas 24h)**: Lista específica de produtos para compra imediata
- **IMPORTANTE (Próximos 7 dias)**: Planejamento de reposição semanal
- **ATENÇÃO (Próximos 30 dias)**: Ajustes estratégicos de longo prazo

## 3. 💰 ANÁLISE FINANCEIRA AVANÇADA
- **ROI por produto**: Identificação dos produtos mais rentáveis
- **Custo de oportunidade**: Produtos com capital parado
- **Margem de contribuição**: Análise de lucratividade real
- **Otimização de capital**: Sugestões para melhor alocação de recursos

## 4. 📊 INSIGHTS BASEADOS EM DADOS
- **Padrões identificados**: Tendências de consumo observadas
- **Sazonalidade**: Produtos com comportamento sazonal
- **Benchmarks**: Comparação com padrões da indústria
- **Previsões**: Projeções baseadas nos dados atuais

## 5. 🎲 ESTRATÉGIAS DE OTIMIZAÇÃO
- **Mix de produtos**: Sugestões para equilibrar o portfólio
- **Política de estoque**: Ajustes nos níveis mínimos e máximos
- **Parcerias estratégicas**: Oportunidades com fornecedores
- **Tecnologia**: Ferramentas para automatizar a gestão

## 6. 📋 PLANO DE AÇÃO 30-60-90 DIAS
- **30 dias**: Correções operacionais imediatas
- **60 dias**: Implementação de melhorias estruturais
- **90 dias**: Otimizações avançadas e automações

**FORMATO**: Resposta executiva, dados quantitativos, recomendações acionáveis e cronograma específico.
`

    return await this.makeGeminiRequest(prompt)
  }

  async suggestMenuOptimization(menuData: any, inventoryData: any): Promise<string> {
    const prompt = `
Você é um consultor especialista em otimização de cardápios para restaurantes. Analise o cardápio atual e o estoque disponível para fornecer sugestões de otimização.

Dados do cardápio:
${JSON.stringify(menuData, null, 2)}

Dados do estoque:
${JSON.stringify(inventoryData, null, 2)}

Por favor, forneça recomendações sobre:

1. **Otimização do Cardápio**
   - Pratos que devem ser promovidos (baseado no estoque)
   - Pratos que devem ser temporariamente removidos
   - Sugestões de novos pratos com ingredientes disponíveis

2. **Gestão de Ingredientes**
   - Como aproveitar melhor os ingredientes em estoque
   - Sugestões para reduzir desperdício
   - Combinações eficientes de ingredientes

3. **Estratégia de Vendas**
   - Quais pratos têm melhor margem de lucro
   - Sugestões de combos e promoções
   - Análise de custo vs preço de venda

4. **Planejamento Semanal**
   - Cardápio sugerido para os próximos dias
   - Considerações sazonais
   - Balanceamento nutricional

Formate a resposta de forma clara e prática para implementação imediata.
`

    return await this.makeGeminiRequest(prompt)
  }

  async generatePurchaseSuggestions(inventoryData: any, salesHistory?: any): Promise<string> {
    const prompt = `
Você é um especialista sênior em Supply Chain e Procurement para estabelecimentos alimentícios, com expertise em análise preditiva e otimização de compras.

DADOS PARA ANÁLISE:
${JSON.stringify(inventoryData, null, 2)}

${salesHistory ? `HISTÓRICO DE VENDAS:
${JSON.stringify(salesHistory, null, 2)}` : ''}

ANÁLISE ESTRATÉGICA DE COMPRAS SOLICITADA:

## 🚨 URGÊNCIAS OPERACIONAIS (24-48h)
**COMPRAR IMEDIATAMENTE:**
- Lista específica com quantidades exatas
- Fornecedores preferenciais ou alternativos
- Impacto na operação se não comprados
- Budget estimado necessário

## 📅 CRONOGRAMA INTELIGENTE (7-30 dias)
**PLANEJAMENTO OTIMIZADO:**
- **Semana 1**: Produtos com prazo crítico
- **Semana 2**: Reposição estratégica
- **Semana 3-4**: Compras de oportunidade
- **Fluxo de caixa**: Distribuição do investimento

## 💰 OTIMIZAÇÃO FINANCEIRA
**ESTRATÉGIAS DE ECONOMIA:**
- Compras em volume: oportunidades identificadas
- Substituições inteligentes: produtos similares mais baratos
- Negociação com fornecedores: produtos para renegociar preços
- ROI de compras: produtos com melhor retorno

## 🔮 ANÁLISE PREDITIVA AVANÇADA
**PREVISÕES BASEADAS EM DADOS:**
- Tendências de consumo identificadas
- Sazonalidade: produtos com demanda cíclica
- Crescimento projetado: itens em alta
- Riscos de mercado: produtos com possível escassez

## 🎯 ESTRATÉGIAS COMPETITIVAS
**VANTAGENS OPERACIONAIS:**
- Diversificação de fornecedores: redução de riscos
- Produtos premium: oportunidades de diferenciação
- Inovações de mercado: novos produtos para testar
- Parcerias estratégicas: acordos de longo prazo

## 📊 MÉTRICAS E KPIs
**INDICADORES DE PERFORMANCE:**
- Giro de estoque por categoria
- Custo médio de aquisição
- Prazo médio de pagamento otimizado
- Redução de desperdício projetada

**FORMATO**: Relatório executivo com dados quantitativos, cronograma específico e recomendações imediatamente implementáveis.
`

    return await this.makeGeminiRequest(prompt)
  }

  async analyzePerformance(performanceData: any): Promise<string> {
    const prompt = `
Você é um consultor especialista em análise de performance e KPIs para restaurantes. Analise os dados de performance fornecidos e forneça insights estratégicos.

Dados de Performance:
${JSON.stringify(performanceData, null, 2)}

Por favor, forneça uma análise detalhada incluindo:

1. **KPIs Principais**
   - Análise do valor total do inventário
   - Taxa de giro de estoque
   - Índice de rentabilidade
   - Performance por categoria

2. **Benchmarks e Comparações**
   - Como os números se comparam com padrões da indústria
   - Produtos com melhor performance
   - Produtos com performance abaixo do esperado

3. **Pontos de Melhoria**
   - Gargalos operacionais identificados
   - Oportunidades de otimização
   - Produtos subutilizados

4. **Recomendações Estratégicas**
   - Ações para melhorar a rentabilidade
   - Estratégias de precificação
   - Otimização do mix de produtos

5. **Análise Preditiva**
   - Tendências observadas
   - Riscos potenciais
   - Oportunidades de crescimento

6. **Plano de Ação**
   - Prioridades para os próximos 30 dias
   - Métricas a acompanhar
   - Objetivos mensuráveis

Formate a resposta de forma executiva e acionável, usando markdown para melhor visualização.
`

    return await this.makeGeminiRequest(prompt)
  }

  async askQuestion(question: string, context?: any): Promise<string> {
    const prompt = `
Você é um assistente especializado em gestão de restaurantes e estoque. Responda à pergunta do usuário de forma clara e útil.

${context ? `Contexto relevante:
${JSON.stringify(context, null, 2)}` : ''}

Pergunta do usuário: ${question}

Por favor, forneça uma resposta detalhada e prática, considerando o contexto da gestão de restaurantes.
`

    return await this.makeGeminiRequest(prompt)
  }
}

export const aiService = new AIService()