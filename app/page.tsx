'use client'

import { useState } from 'react'

type Curso = {
  vendas: number
  bookedTotal: number
  ticket: number
  status: string
  abertura: string
  encCarrinho: string
  alerta?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  'Finalizado':   '#e8f5e9',
  'Em execução':  '#fff8e1',
  'Não iniciada': '#f5f5f5',
}

const STATUS_TEXT: Record<string, string> = {
  'Finalizado':   '#2e7d32',
  'Em execução':  '#e65100',
  'Não iniciada': '#757575',
}

const MESES_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const MEDALS   = ['🥇','🥈','🥉']

function toMonthVal(ddmmyyyy: string): number | null {
  if (!ddmmyyyy || ddmmyyyy === 'N/D') return null
  const p = ddmmyyyy.split('/')
  if (p.length !== 3) return null
  return parseInt(p[2]) * 12 + parseInt(p[1])
}

function mmyyyyKey(m: number, y: number): string {
  return `${String(m).padStart(2, '0')}/${y}`
}

function fmtMesLabel(mmyyyy: string): string {
  const [mm, yyyy] = mmyyyy.split('/')
  return `${MESES_PT[parseInt(mm) - 1]} ${yyyy}`
}

export default function Home() {
  const [search, setSearch]           = useState('')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [mesFiltro, setMesFiltro]     = useState('Todos')

  const cursos: Record<string, Curso> = {
    "Intensivo TPI 2026":             { vendas: 11,   bookedTotal: 16490.16,   ticket: 1499.11, status: 'Finalizado',   abertura: '17/11/2025', encCarrinho: '08/02/2026' },
    "Intensivo TED 2026":             { vendas: 16,   bookedTotal: 28680.09,   ticket: 1792.51, status: 'Em execução',  abertura: '17/11/2025', encCarrinho: '19/04/2026' },
    "Extensivo TED/TPI (1 e 2 anos)": { vendas: 70,   bookedTotal: 323051.44,  ticket: 4615.02, status: 'Em execução',  abertura: '29/01/2026', encCarrinho: '29/01/2027' },
    "Extensivo TED/TPI (3 anos)":     { vendas: 15,   bookedTotal: 122499.76,  ticket: 8166.65, status: 'Em execução',  abertura: '09/03/2026', encCarrinho: '09/03/2027' },
    "CR Revalida Presencial 25.2":    { vendas: 54,   bookedTotal: 29836.00,   ticket: 542.47,  status: 'Finalizado',   abertura: '23/03/2026', encCarrinho: '07/05/2026' },
    "Intensivo Revalida 26.2":        { vendas: 2,    bookedTotal: 4542.27,    ticket: 2271.14, status: 'Não iniciada', abertura: '23/03/2026', encCarrinho: '26/08/2026' },
    "Extensivo R+ CM 2026":           { vendas: 1009, bookedTotal: 8831287.05, ticket: 8752.51, status: 'Em execução',  abertura: '01/10/2025', encCarrinho: '03/08/2026' },
    "Extensivo R+ PED 2026":          { vendas: 261,  bookedTotal: 2076133.64, ticket: 7954.54, status: 'Em execução',  abertura: '01/10/2025', encCarrinho: '03/08/2026' },
    "Extensivo R+ GO 2026":           { vendas: 233,  bookedTotal: 1727381.90, ticket: 7413.66, status: 'Em execução',  abertura: '01/10/2025', encCarrinho: '03/08/2026' },
    "Extensivo R+ CIR 2026":          { vendas: 193,  bookedTotal: 1223281.32, ticket: 6338.25, status: 'Em execução',  abertura: '01/10/2025', encCarrinho: '03/08/2026' },
    "CR Revalida Online 25.2":        { vendas: 418,  bookedTotal: 0,          ticket: 0,       status: 'Em execução',  abertura: '23/03/2026', encCarrinho: '18/05/2026', alerta: true },
    "Intensivo Revalida 26.1":        { vendas: 1096, bookedTotal: 0,          ticket: 0,       status: 'Em execução',  abertura: '23/03/2026', encCarrinho: '07/06/2026', alerta: true },
    "Extensivo Revalida 27.1":        { vendas: 8,    bookedTotal: 0,          ticket: 0,       status: 'Não iniciada', abertura: '23/03/2026', encCarrinho: '23/03/2027', alerta: true },
  }

  // Build month dropdown from selling periods
  const allMonthsSet = new Set<string>()
  Object.values(cursos).forEach(c => {
    const ab  = toMonthVal(c.abertura)
    const enc = toMonthVal(c.encCarrinho)
    if (ab === null || enc === null) return
    let val = ab
    while (val <= enc) {
      const y = Math.floor((val - 1) / 12)
      const m = val - y * 12
      allMonthsSet.add(mmyyyyKey(m, y))
      val++
    }
  })
  const mesesDisponiveis = [
    'Todos',
    ...Array.from(allMonthsSet).sort((a, b) => {
      const [am, ay] = a.split('/').map(Number)
      const [bm, by] = b.split('/').map(Number)
      return ay !== by ? ay - by : am - bm
    }),
  ]

  const statusList = ['Todos', ...Array.from(new Set(Object.values(cursos).map(c => c.status)))]

  const filtered = Object.entries(cursos).filter(([nome, dados]) => {
    const matchSearch = nome.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFiltro === 'Todos' || dados.status === statusFiltro
    let matchMes = true
    if (mesFiltro !== 'Todos') {
      const [selM, selY] = mesFiltro.split('/').map(Number)
      const selVal = selY * 12 + selM
      const ab  = toMonthVal(dados.abertura)
      const enc = toMonthVal(dados.encCarrinho)
      matchMes = ab !== null && enc !== null && selVal >= ab && selVal <= enc
    }
    return matchSearch && matchStatus && matchMes
  })

  const comReceita  = filtered.filter(([, d]) => d.bookedTotal > 0).sort((a, b) => b[1].bookedTotal - a[1].bookedTotal)
  const focoLeads   = filtered.filter(([, d]) => d.bookedTotal === 0).sort((a, b) => b[1].vendas - a[1].vendas)

  // KPIs computed over all filtered courses
  const allFiltered  = filtered.map(([, d]) => d)
  const totalVendas  = allFiltered.reduce((s, c) => s + c.vendas, 0)
  const totalBooked  = allFiltered.reduce((s, c) => s + c.bookedTotal, 0)
  const vendasComVal = allFiltered.filter(c => c.bookedTotal > 0).reduce((s, c) => s + c.vendas, 0)
  const ticketGeral  = vendasComVal > 0 ? totalBooked / vendasComVal : 0

  const top3Booked = [...comReceita].slice(0, 3)
  const top3Vendas = [...filtered].sort((a, b) => b[1].vendas - a[1].vendas).slice(0, 3)

  const fmt  = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmtK = (v: number) => v >= 1_000_000
    ? `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`
    : `R$ ${(v / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}K`

  const Tabela = ({ rows, mostrarBooked }: { rows: [string, Curso][], mostrarBooked: boolean }) => (
    <div style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#00205B', color: '#fff' }}>
            {['Curso', 'Nº Vendas', ...(mostrarBooked ? ['Booked Sales Total', 'Ticket Médio'] : []), 'Status', 'Enc. Carrinho'].map(h => (
              <th key={h} style={{ padding: '12px 14px', textAlign: h === 'Curso' ? 'left' : 'center', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([nome, dados], i) => (
            <tr key={nome} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: dados.alerta ? '#fffde7' : i % 2 === 0 ? '#fafafa' : '#fff' }}>
              <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 500 }}>
                {dados.alerta && <span style={{ color: '#f57c00', marginRight: '6px' }}>⚠️</span>}
                {nome}
              </td>
              <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
                {dados.vendas.toLocaleString('pt-BR')}
              </td>
              {mostrarBooked && <>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '13px' }}>
                  {`R$ ${fmt(dados.bookedTotal)}`}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '13px', color: dados.ticket > 0 ? '#1a1a1a' : '#bbb' }}>
                  {dados.ticket > 0 ? `R$ ${fmt(dados.ticket)}` : '—'}
                </td>
              </>}
              <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                <span style={{ backgroundColor: STATUS_COLORS[dados.status] || '#f5f5f5', color: STATUS_TEXT[dados.status] || '#333', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                  {dados.status}
                </span>
              </td>
              <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '12px', color: '#999' }}>{dados.encCarrinho}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', fontSize: '13px', color: '#aaa' }}>Nenhum curso para os filtros selecionados.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ backgroundColor: '#00205B', color: '#fff', padding: '1.5rem 2rem' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Medway Mais - Dashboard</h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '13px', opacity: 0.8 }}>Dados HubSpot • Roadmap GTM 26/27 • 11/05/2026</p>
      </header>

      <div style={{ maxWidth: '1300px', margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total de Vendas',    value: totalVendas.toLocaleString('pt-BR'), color: '#00205B' },
            { label: 'Booked Sales Total', value: `R$ ${fmt(totalBooked)}`,            color: '#0C447C' },
            { label: 'Ticket Médio Geral', value: `R$ ${fmt(ticketGeral)}`,            color: '#27500A' },
            { label: 'Cursos Ativos',      value: allFiltered.filter(c => c.status === 'Em execução').length.toString(), color: '#6a1b9a' },
          ].map(card => (
            <div key={card.label} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: card.color, marginTop: '0.3rem' }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Top 3 Rankings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Top 3 — Booked Sales</div>
            {top3Booked.map(([nome, dados], i) => (
              <div key={nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '18px' }}>{MEDALS[i]}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>{nome}</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0C447C', whiteSpace: 'nowrap' }}>{fmtK(dados.bookedTotal)}</span>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Top 3 — Nº de Vendas</div>
            {top3Vendas.map(([nome, dados], i) => (
              <div key={nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '18px' }}>{MEDALS[i]}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>{nome}</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#00205B' }}>{dados.vendas.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar curso..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '0.6rem 0.9rem', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
          <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)}
            style={{ padding: '0.6rem 0.9rem', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff' }}>
            {statusList.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={mesFiltro} onChange={e => setMesFiltro(e.target.value)}
            style={{ padding: '0.6rem 0.9rem', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff' }}>
            {mesesDisponiveis.map(m => (
              <option key={m} value={m}>{m === 'Todos' ? 'Todos os meses' : fmtMesLabel(m)}</option>
            ))}
          </select>
        </div>

        {/* Seção: Traz Receita */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '16px' }}>💰</span>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>Traz Receita</h2>
            <span style={{ fontSize: '12px', color: '#888' }}>({comReceita.length} curso{comReceita.length !== 1 ? 's' : ''})</span>
          </div>
          <Tabela rows={comReceita} mostrarBooked={true} />
        </div>

        {/* Seção: Foco em Leads */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '16px' }}>🎯</span>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>Foco em Leads</h2>
            <span style={{ fontSize: '12px', color: '#888' }}>({focoLeads.length} curso{focoLeads.length !== 1 ? 's' : ''})</span>
            <span style={{ fontSize: '11px', color: '#f57c00', backgroundColor: '#fff8e1', padding: '2px 8px', borderRadius: '10px', border: '1px solid #ffe082' }}>
              ⚠️ Verificar integração de pagamento no HubSpot
            </span>
          </div>
          <Tabela rows={focoLeads} mostrarBooked={false} />
        </div>

        <p style={{ marginTop: '1rem', fontSize: '11px', color: '#aaa', textAlign: 'right' }}>
          * Somente deals com status "Negócio Faturado" no HubSpot • Datas de encerramento extraídas do Roadmap GTM 26/27
        </p>
      </div>
    </div>
  )
}
