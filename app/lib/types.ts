export type Curso = {
  vendas: number
  bookedTotal: number
  ticket: number
  status: string
  encCarrinho: string
  secao: 'receita' | 'leads'
  alerta?: boolean
}
