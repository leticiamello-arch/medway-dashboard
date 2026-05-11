'use client'

import { useState } from 'react'

type Curso = {
  vendas: number
  bookedTotal: number
  ticket: number
  status: string
  encCarrinho: string
  alerta?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  'Finalizado':     '#e8f5e9',
  'Acompanhamento': '#e3f2fd',
  'Em execução':    '#fff8e1',
  'Expansão':       '#f3e5f5',
  'Não iniciada':   '#f5f5f5',
}

const STATUS_TEXT: Record<string, string> = {
  'Finalizado':     '#2e7d32',
  'Acompanhamento': '#1565c0',
  'Em execução':    '#e65100',
  'Expansão':       '#6a1b9a',
  'Não iniciada':   '#757575',
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('Todos')

  const cursos: Record<string, Curso> = {
    "Intensivo TPI 2026":              { vendas: 11,   bookedTotal: 16490.16,  ticket: 1499.11,  status: 'Finalizado',     encCarrinho: '08/02/2026' },
    "Intensivo TED 2026":              { vendas: 16,   bookedTotal: 28680.09,  ticket: 1792.51,  status: 'Acompanhamento', encCarrinho: '19/04/2026' },
    "Extensivo TED/TPI (1 e 2 anos)":  { vendas: 70,   bookedTotal: 323051.44, ticket: 4615.02,  status: 'Acompanhamento', encCarrinho: '29/01/2027' },
    "Extensivo TED/TPI (3 anos)":      { vendas: 15,   bookedTotal: 122499.76, ticket: 8166.65,  status: 'Acompanhamento', encCarrinho: '09/03/2027' },
    "CR Revalida Presencial 25.2":     { vendas: 54,   bookedTotal: 29836.00,  ticket: 542.47,   status: 'Expansão',       encCarrinho: '07/05/2026' },
    "CR Revalida Online 25.2":         { vendas: 418,  bookedTotal: 0,         ticket: 0,        status: 'Em execução',    encCarrinho: '18/05/2026', alerta: true },
    "Intensivo Revalida 26.1":         { vendas: 1096, bookedTotal: 0,         ticket: 0,        status: 'Em execução',    encCarrinho: '07/06/2026', alerta: true },
    "Intensivo Revalida 26.2":         { vendas: 2,    bookedTotal: 4542.27,   ticket: 2271.14,  status: 'Não iniciada',   encCarrinho: '26/08/2026' },
    "Extensivo Revalida 27.1":         { vendas: 8,    bookedTotal: 0,         ticket: 0,        status: 'Não iniciada',   encCarrinho: '23/03/2027', alerta: true },
    "Extensivo R+ CM - 2027":          { vendas: 0,    bookedTotal: 0,         ticket: 0,        status: 'Não iniciada',   encCarrinho: '31/03/2027' },
    "Extensivo R+ GO - 2027":          { vendas: 0,    bookedTotal: 0,         ticket: 0,        status: 'Não iniciada',   encCarrinho: '31/03/2027' },
    "Extensivo R+ PED - 2027":         { vendas: 0,    bookedTotal: 0,         ticket: 0,        status: 'Não iniciada',   encCarrinho: '31/03/2027' },
    "Extensivo R+ CIR - 2027":         { vendas: 0,    bookedTotal: 0,         ticket: 0,        status: 'Não iniciada',   encCarrinho: '31/03/2027' },
    "Extensivo R+ Endoscopia":         { vendas: 0,    bookedTotal: 0,         ticket: 0,        status: 'Não iniciada',   encCarrinho: '01/03/2027' },
    "Extensivo R+ Mastologia":         { vendas: 0,    bookedTotal: 0,         ticket: 0,        status: 'Não iniciada',   encCarrinho: '01/03/2027' },
  }

  const statusList = ['Todos', ...Array.from(new Set(Object.values(cursos).map(c => c.status)))]

  const filtered = Object.entries(cursos)
    .filter(([nome, dados]) => {
      const matchSearch = nome.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFiltro === 'Todos' || dados.status === statusFiltro
      return matchSearch && matchStatus
    })
    .sort((a, b) => b[1].bookedTotal - a[1].bookedTotal)

  const totalVendas    = Object.values(cursos).reduce((s, c) => s + c.vendas, 0)
  const totalBooked    = Object.values(cursos).reduce((s, c) => s + c.bookedTotal, 0)
  const ticketGeral    = totalVendas > 0 ? totalBooked / Object.values(cursos).filter(c => c.bookedTotal > 0).reduce((s, c) => s + c.vendas, 0) : 0

  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ backgroundColor: '#00205B', color: '#fff', padding: '1.5rem 2rem' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Medway — Dashboard de Cursos</h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '13px', opacity: 0.8 }}>Dados HubSpot • Roadmap GTM 26/27 • 11/05/2026</p>
      </header>

      <div style={{ maxWidth: '1300px', margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total de Vendas',    value: totalVendas.toLocaleString('pt-BR'), color: '#00205B' },
            { label: 'Booked Sales Total', value: `R$ ${fmt(totalBooked)}`,            color: '#0C447C' },
            { label: 'Ticket Médio Geral', value: `R$ ${fmt(ticketGeral)}`,            color: '#27500A' },
            { label: 'Cursos Ativos',      value: Object.values(cursos).filter(c => ['Em execução','Acompanhamento','Expansão'].includes(c.status)).length.toString(), color: '#6a1b9a' },
          ].map(card => (
            <div key={card.label} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: card.color, marginTop: '0.3rem' }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Alerta */}
        <div style={{ backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '13px', color: '#795548' }}>
          ⚠️ <strong>CR Revalida Online 25.2</strong>, <strong>Intensivo Revalida 26.1</strong> e <strong>Extensivo Revalida 27.1</strong> possuem deals faturados mas valor = R$0 no HubSpot. Verificar integração de pagamento.
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar curso..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '0.6rem 0.9rem', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
          <select
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value)}
            style={{ padding: '0.6rem 0.9rem', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff' }}
          >
            {statusList.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Tabela */}
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#00205B', color: '#fff' }}>
                {['Curso', 'Nº Vendas', 'Booked Sales Total', 'Ticket Médio', 'Status', 'Enc. Carrinho'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: h === 'Curso' ? 'left' : 'center', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(([nome, dados], i) => (
                <tr key={nome} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: dados.alerta ? '#fffde7' : i % 2 === 0 ? '#fafafa' : '#fff' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 500 }}>
                    {dados.alerta && <span style={{ color: '#f57c00', marginRight: '6px' }}>⚠️</span>}
                    {nome}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>{dados.vendas.toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '13px', color: dados.bookedTotal > 0 ? '#1a1a1a' : '#bbb' }}>
                    {dados.bookedTotal > 0 ? `R$ ${fmt(dados.bookedTotal)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '13px', color: dados.ticket > 0 ? '#1a1a1a' : '#bbb' }}>
                    {dados.ticket > 0 ? `R$ ${fmt(dados.ticket)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ backgroundColor: STATUS_COLORS[dados.status] || '#f5f5f5', color: STATUS_TEXT[dados.status] || '#333', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                      {dados.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '12px', color: '#999' }}>{dados.encCarrinho}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '11px', color: '#aaa', textAlign: 'right' }}>
          * Somente deals com status "Negócio Faturado" no HubSpot • Datas de encerramento de carrinho extraídas do Roadmap GTM 26/27
        </p>
      </div>
    </div>
  )
}