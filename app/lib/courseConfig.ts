// Configuração estática de cada curso:
//   searchTerms → tokens buscados com CONTAINS_TOKEN no nome do deal (lógica AND)
//   fallback    → valores usados se HUBSPOT_TOKEN não estiver configurado
//
// ⚠️  Verifique se os searchTerms batem com o padrão de nome dos deals no seu HubSpot.
//     Exemplo: se o deal se chama "Extensivo R+ CM 2026 - João Silva", use ["R+ CM"].

export type CursoConfig = {
  status: string
  encCarrinho: string
  secao: 'receita' | 'leads'
  alerta?: boolean
  searchTerms: string[]
  fallback: { vendas: number; bookedTotal: number }
}

export const COURSE_CONFIG: Record<string, CursoConfig> = {
  'Intensivo TPI 2026': {
    status: 'Finalizado',
    encCarrinho: '08/02/2026',
    secao: 'receita',
    searchTerms: ['Intensivo TPI'],
    fallback: { vendas: 11, bookedTotal: 16490.16 },
  },
  'Intensivo TED 2026': {
    status: 'Em execução',
    encCarrinho: '19/04/2026',
    secao: 'receita',
    searchTerms: ['Intensivo TED'],
    fallback: { vendas: 16, bookedTotal: 28680.09 },
  },
  'Extensivo TED/TPI (1 e 2 anos)': {
    status: 'Em execução',
    encCarrinho: '29/01/2027',
    secao: 'receita',
    // ⚠️ Ajuste se o nome do deal usar outra forma (ex: "Ext TED 1 ano")
    searchTerms: ['Extensivo TED', '1'],
    fallback: { vendas: 70, bookedTotal: 323051.44 },
  },
  'Extensivo TED/TPI (3 anos)': {
    status: 'Em execução',
    encCarrinho: '09/03/2027',
    secao: 'receita',
    // ⚠️ Ajuste se o nome do deal usar outra forma (ex: "Ext TED 3 anos")
    searchTerms: ['Extensivo TED', '3'],
    fallback: { vendas: 15, bookedTotal: 122499.76 },
  },
  'CR Revalida Presencial 25.2': {
    status: 'Finalizado',
    encCarrinho: '07/05/2026',
    secao: 'receita',
    searchTerms: ['CR Revalida Presencial'],
    fallback: { vendas: 54, bookedTotal: 29836.00 },
  },
  'Intensivo Revalida 26.2': {
    status: 'Em execução',
    encCarrinho: '26/08/2026',
    secao: 'receita',
    searchTerms: ['Revalida', '26.2'],
    fallback: { vendas: 2, bookedTotal: 4542.27 },
  },
  'Extensivo Revalida 27.1': {
    status: 'Em execução',
    encCarrinho: '23/03/2027',
    secao: 'receita',
    alerta: true,
    searchTerms: ['Extensivo Revalida', '27'],
    fallback: { vendas: 8, bookedTotal: 0 },
  },
  'Extensivo R+ CM 2026': {
    status: 'Em execução',
    encCarrinho: '03/08/2026',
    secao: 'receita',
    searchTerms: ['R+ CM'],
    fallback: { vendas: 1009, bookedTotal: 8831287.05 },
  },
  'Extensivo R+ PED 2026': {
    status: 'Em execução',
    encCarrinho: '03/08/2026',
    secao: 'receita',
    searchTerms: ['R+ PED'],
    fallback: { vendas: 261, bookedTotal: 2076133.64 },
  },
  'Extensivo R+ GO 2026': {
    status: 'Em execução',
    encCarrinho: '03/08/2026',
    secao: 'receita',
    searchTerms: ['R+ GO'],
    fallback: { vendas: 233, bookedTotal: 1727381.90 },
  },
  'Extensivo R+ CIR 2026': {
    status: 'Em execução',
    encCarrinho: '03/08/2026',
    secao: 'receita',
    searchTerms: ['R+ CIR'],
    fallback: { vendas: 193, bookedTotal: 1223281.32 },
  },
  'CR Revalida Online 25.2': {
    status: 'Em execução',
    encCarrinho: '18/05/2026',
    secao: 'leads',
    alerta: true,
    searchTerms: ['CR Revalida Online'],
    fallback: { vendas: 418, bookedTotal: 0 },
  },
  'Intensivo Revalida 26.1': {
    status: 'Em execução',
    encCarrinho: '07/06/2026',
    secao: 'leads',
    alerta: true,
    searchTerms: ['Revalida', '26.1'],
    fallback: { vendas: 1096, bookedTotal: 0 },
  },
  'Reta Final TEP': {
    status: 'Em execução',
    encCarrinho: '01/06/2026',
    secao: 'leads',
    searchTerms: ['Reta Final TEP'],
    fallback: { vendas: 435, bookedTotal: 0 },
  },
  'Reta Final TEGO/TPI': {
    status: 'Em execução',
    encCarrinho: '01/07/2026',
    secao: 'leads',
    searchTerms: ['Reta Final TEGO'],
    fallback: { vendas: 318, bookedTotal: 0 },
  },
  'Reta Final TECM': {
    status: 'Em execução',
    encCarrinho: '01/10/2026',
    secao: 'leads',
    searchTerms: ['Reta Final TECM'],
    fallback: { vendas: 93, bookedTotal: 0 },
  },
}
