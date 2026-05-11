'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, LabelList,
} from 'recharts'

type Curso = {
  vendas: number
  bookedTotal: number
  ticket: number
  status: string
  encCarrinho: string
  secao: 'receita' | 'leads'
  alerta?: boolean
}

// Paleta oficial Medway
const MW = {
  navy:   '#00205B',
  blue:   '#003D8F',
  mid:    '#0057A8',
  sky:    '#0073CF',
  light:  '#1E90D6',
  pale:   '#4DADE8',
  frost:  '#99CCEF',
  bg:     '#EEF3FA',
}

const BAR_COLORS  = [MW.navy, MW.blue, MW.mid, MW.sky, MW.light, MW.pale, MW.frost, MW.pale, MW.sky, MW.mid]
const PIE_COLORS  = [MW.navy, MW.mid, MW.sky, MW.light, MW.pale, MW.frost]

const STATUS_COLORS: Record<string, string> = {
  'Finalizado':   '#E8EFF9',
  'Em execução':  '#D6E8F8',
  'Não iniciada': '#f5f5f5',
}
const STATUS_TEXT: Record<string, string> = {
  'Finalizado':   MW.navy,
  'Em execução':  MW.mid,
  'Não iniciada': '#757575',
}

const MEDALS = ['🥇','🥈','🥉']

const fmt  = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtK = (v: number) => {
  if (v === 0) return '—'
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`
  return `R$ ${(v / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}K`
}

// Legenda customizada para o donut (evita corte)
function CustomLegend({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
      {data.map(d => (
        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: '#555', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</span>
          <span style={{ fontSize: '11px', color: MW.navy, fontWeight: 700, whiteSpace: 'nowrap' }}>
            {((d.value / total) * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const [search, setSearch]             = useState('')
  const [statusFiltro, setStatusFiltro] = useState('Todos')

  const cursos: Record<string, Curso> = {
    "Intensivo TPI 2026":             { vendas: 11,   bookedTotal: 16490.16,   ticket: 1499.11, status: 'Finalizado',   encCarrinho: '08/02/2026', secao: 'receita' },
    "Intensivo TED 2026":             { vendas: 16,   bookedTotal: 28680.09,   ticket: 1792.51, status: 'Em execução',  encCarrinho: '19/04/2026', secao: 'receita' },
    "Extensivo TED/TPI (1 e 2 anos)": { vendas: 70,   bookedTotal: 323051.44,  ticket: 4615.02, status: 'Em execução',  encCarrinho: '29/01/2027', secao: 'receita' },
    "Extensivo TED/TPI (3 anos)":     { vendas: 15,   bookedTotal: 122499.76,  ticket: 8166.65, status: 'Em execução',  encCarrinho: '09/03/2027', secao: 'receita' },
    "CR Revalida Presencial 25.2":    { vendas: 54,   bookedTotal: 29836.00,   ticket: 542.47,  status: 'Finalizado',   encCarrinho: '07/05/2026', secao: 'receita' },
    "Intensivo Revalida 26.2":        { vendas: 2,    bookedTotal: 4542.27,    ticket: 2271.14, status: 'Em execução',  encCarrinho: '26/08/2026', secao: 'receita' },
    "Extensivo Revalida 27.1":        { vendas: 8,    bookedTotal: 0,          ticket: 0,       status: 'Em execução',  encCarrinho: '23/03/2027', secao: 'receita', alerta: true },
    "Extensivo R+ CM 2026":           { vendas: 1009, bookedTotal: 8831287.05, ticket: 8752.51, status: 'Em execução',  encCarrinho: '03/08/2026', secao: 'receita' },
    "Extensivo R+ PED 2026":          { vendas: 261,  bookedTotal: 2076133.64, ticket: 7954.54, status: 'Em execução',  encCarrinho: '03/08/2026', secao: 'receita' },
    "Extensivo R+ GO 2026":           { vendas: 233,  bookedTotal: 1727381.90, ticket: 7413.66, status: 'Em execução',  encCarrinho: '03/08/2026', secao: 'receita' },
    "Extensivo R+ CIR 2026":          { vendas: 193,  bookedTotal: 1223281.32, ticket: 6338.25, status: 'Em execução',  encCarrinho: '03/08/2026', secao: 'receita' },
    "CR Revalida Online 25.2":        { vendas: 418,  bookedTotal: 0,          ticket: 0,       status: 'Em execução',  encCarrinho: '18/05/2026', secao: 'leads',   alerta: true },
    "Intensivo Revalida 26.1":        { vendas: 1096, bookedTotal: 0,          ticket: 0,       status: 'Em execução',  encCarrinho: '07/06/2026', secao: 'leads',   alerta: true },
    "Reta Final TEP":                 { vendas: 435,  bookedTotal: 0,          ticket: 0,       status: 'Em execução',  encCarrinho: '01/06/2026', secao: 'leads' },
    "Reta Final TEGO/TPI":            { vendas: 318,  bookedTotal: 0,          ticket: 0,       status: 'Em execução',  encCarrinho: '01/07/2026', secao: 'leads' },
    "Reta Final TECM":                { vendas: 93,   bookedTotal: 0,          ticket: 0,       status: 'Em execução',  encCarrinho: '01/10/2026', secao: 'leads' },
  }

  const statusList = ['Todos', ...Array.from(new Set(Object.values(cursos).map(c => c.status)))]

  const filtered = Object.entries(cursos).filter(([nome, dados]) => {
    const matchSearch = nome.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFiltro === 'Todos' || dados.status === statusFiltro
    return matchSearch && matchStatus
  })

  const secaoReceita = filtered.filter(([, d]) => d.secao === 'receita').sort((a, b) => b[1].bookedTotal - a[1].bookedTotal)
  const secaoLeads   = filtered.filter(([, d]) => d.secao === 'leads').sort((a, b) => b[1].vendas - a[1].vendas)

  const receitaList = filtered.filter(([, d]) => d.secao === 'receita').map(([, d]) => d)
  const leadsList   = filtered.filter(([, d]) => d.secao === 'leads').map(([, d]) => d)

  const vendasReceita = receitaList.reduce((s, c) => s + c.vendas, 0)
  const bookedReceita = receitaList.reduce((s, c) => s + c.bookedTotal, 0)
  const vendasComValR = receitaList.filter(c => c.bookedTotal > 0).reduce((s, c) => s + c.vendas, 0)
  const ticketReceita = vendasComValR > 0 ? bookedReceita / vendasComValR : 0

  const totalLeads  = leadsList.reduce((s, c) => s + c.vendas, 0)
  const cursosLeads = leadsList.length

  const top3Booked = [...secaoReceita].slice(0, 3)
  const top3Vendas = [...filtered].sort((a, b) => b[1].vendas - a[1].vendas).slice(0, 3)

  const barDataBooked = secaoReceita
    .filter(([, d]) => d.bookedTotal > 0)
    .map(([nome, d]) => ({
      name:  nome.length > 20 ? nome.slice(0, 20) + '…' : nome,
      value: Math.round(d.bookedTotal),
      label: fmtK(d.bookedTotal),
    }))
    .sort((a, b) => b.value - a.value)

  const pieDataLeads = secaoLeads.map(([nome, d], i) => ({
    name:  nome,
    value: d.vendas,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }))

  const kpiReceita = [
    { label: 'Nº de Vendas', value: vendasReceita.toLocaleString('pt-BR'), sub: 'deals faturados',       color: MW.navy },
    { label: 'Booked Sales', value: fmtK(bookedReceita),                   sub: 'receita registrada',    color: MW.mid  },
    { label: 'Ticket Médio', value: `R$ ${fmt(ticketReceita)}`,            sub: 'por venda com receita', color: MW.sky  },
  ]
  const kpiLeads = [
    { label: 'Total de Leads', value: totalLeads.toLocaleString('pt-BR'), sub: 'leads captados',    color: MW.light },
    { label: 'Cursos Ativos',  value: cursosLeads.toString(),             sub: 'com foco em leads', color: MW.pale  },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: MW.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${MW.navy} 0%, ${MW.mid} 100%)`, color: '#fff', padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px' }}>Medway Mais — Dashboard</h1>
          <p style={{ margin: '0.2rem 0 0', fontSize: '12px', opacity: 0.7 }}>Dados HubSpot · Roadmap GTM 26/27 · 11/05/2026</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <input
            type="text" placeholder="🔍  Buscar curso…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.5rem 0.9rem', fontSize: '13px', border: 'none', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', color: '#fff', outline: 'none', width: '190px' } as React.CSSProperties}
          />
          <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)}
            style={{ padding: '0.5rem 0.9rem', fontSize: '13px', border: 'none', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', color: '#fff', outline: 'none', cursor: 'pointer' }}>
            {statusList.map(s => <option key={s} style={{ color: '#000' }}>{s}</option>)}
          </select>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem' }}>

        {/* KPI Cards — dois grupos */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.25rem', marginBottom: '1.5rem' }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: MW.navy, textTransform: 'uppercase', letterSpacing: '0.08em' }}>💰 Foco em Receita</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#C5D5E8' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {kpiReceita.map(card => (
                <div key={card.label} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.1rem 1.25rem', boxShadow: '0 1px 6px rgba(0,32,91,0.08)', borderTop: `4px solid ${card.color}`, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{card.label}</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: card.color, lineHeight: 1.1 }}>{card.value}</div>
                  <div style={{ fontSize: '10px', color: '#aaa' }}>{card.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: MW.sky, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎯 Foco em Leads</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#C5D5E8' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {kpiLeads.map(card => (
                <div key={card.label} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.1rem 1.25rem', boxShadow: '0 1px 6px rgba(0,32,91,0.08)', borderTop: `4px solid ${card.color}`, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{card.label}</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: card.color, lineHeight: 1.1 }}>{card.value}</div>
                  <div style={{ fontSize: '10px', color: '#aaa' }}>{card.sub}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

          {/* Bar chart — Booked Sales com labels */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 6px rgba(0,32,91,0.08)' }}>
            <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '1rem' }}>Booked Sales por Curso</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barDataBooked} layout="vertical" margin={{ left: 8, right: 80, top: 2, bottom: 2 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EEF3FA" />
                <XAxis type="number" hide />
                <YAxis
                  type="category" dataKey="name"
                  tick={{ fontSize: 11, fill: '#444', fontWeight: 500 }}
                  width={155} axisLine={false} tickLine={false}
                />
                <Tooltip
                  formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Booked Sales']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${MW.frost}`, boxShadow: '0 2px 8px rgba(0,32,91,0.12)' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                  {barDataBooked.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  <LabelList
                    dataKey="label"
                    position="right"
                    style={{ fontSize: 11, fontWeight: 700, fill: MW.navy }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut — Leads com legenda customizada */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 6px rgba(0,32,91,0.08)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '0.5rem' }}>Distribuição de Leads</div>
            <ResponsiveContainer width="100%" height={165}>
              <PieChart>
                <Pie
                  data={pieDataLeads} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={72} innerRadius={38} paddingAngle={3}
                >
                  {pieDataLeads.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [v.toLocaleString('pt-BR'), 'Leads']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${MW.frost}`, boxShadow: '0 2px 8px rgba(0,32,91,0.12)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <CustomLegend data={pieDataLeads} />
          </div>
        </div>

        {/* Top 3 row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { title: 'Top 3 — Booked Sales', rows: top3Booked, getValue: ([, d]: [string, Curso]) => fmtK(d.bookedTotal), color: MW.mid  },
            { title: 'Top 3 — Nº de Vendas',  rows: top3Vendas, getValue: ([, d]: [string, Curso]) => d.vendas.toLocaleString('pt-BR'), color: MW.navy },
          ].map(panel => (
            <div key={panel.title} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 6px rgba(0,32,91,0.08)' }}>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '0.75rem' }}>{panel.title}</div>
              {panel.rows.map((entry, i) => (
                <div key={entry[0]} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: i < 2 ? '1px solid #EEF3FA' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '20px', lineHeight: 1 }}>{MEDALS[i]}</span>
                    <span style={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>{entry[0]}</span>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: panel.color, whiteSpace: 'nowrap' }}>{panel.getValue(entry)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Alerta integração */}
        <div style={{ backgroundColor: '#EEF3FA', border: `1px solid ${MW.frost}`, borderRadius: '10px', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontSize: '12px', color: MW.navy, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span><strong>CR Revalida Online 25.2</strong>, <strong>Intensivo Revalida 26.1</strong> e <strong>Extensivo Revalida 27.1</strong> possuem deals faturados com valor = R$0 no HubSpot. Verificar integração de pagamento.</span>
        </div>

        {/* Tabela Foco em Receita */}
        <SectionHeader icon="💰" title="Foco em Receita" count={secaoReceita.length} />
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,32,91,0.08)', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: `linear-gradient(90deg, ${MW.navy}, ${MW.mid})`, color: '#fff' }}>
                {['Curso', 'Nº Vendas', 'Booked Sales Total', 'Ticket Médio', 'Status', 'Enc. Carrinho'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: h === 'Curso' ? 'left' : 'center', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {secaoReceita.map(([nome, dados], i) => (
                <tr key={nome} style={{ borderBottom: '1px solid #EEF3FA', backgroundColor: dados.alerta ? '#EEF3FA' : i % 2 === 0 ? '#FAFCFF' : '#fff' }}>
                  <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>
                    {dados.alerta && <span style={{ marginRight: '6px' }}>⚠️</span>}
                    {nome}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: MW.navy }}>{dados.vendas.toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'center', fontSize: '13px', fontWeight: dados.bookedTotal > 0 ? 600 : 400, color: dados.bookedTotal > 0 ? MW.mid : '#ccc' }}>
                    {dados.bookedTotal > 0 ? `R$ ${fmt(dados.bookedTotal)}` : '—'}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'center', fontSize: '13px', color: dados.ticket > 0 ? '#333' : '#ccc' }}>
                    {dados.ticket > 0 ? `R$ ${fmt(dados.ticket)}` : '—'}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                    <span style={{ backgroundColor: STATUS_COLORS[dados.status] || '#f5f5f5', color: STATUS_TEXT[dados.status] || '#333', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.03em' }}>
                      {dados.status}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>{dados.encCarrinho}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabela Foco em Leads */}
        <SectionHeader icon="🎯" title="Foco em Leads" count={secaoLeads.length} warning="⚠️ Verificar integração HubSpot" />
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,32,91,0.08)', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: `linear-gradient(90deg, ${MW.navy}, ${MW.mid})`, color: '#fff' }}>
                {['Curso', 'Nº de Leads', 'Status', 'Enc. Carrinho'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: h === 'Curso' ? 'left' : 'center', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {secaoLeads.map(([nome, dados], i) => (
                <tr key={nome} style={{ borderBottom: '1px solid #EEF3FA', backgroundColor: i % 2 === 0 ? '#FAFCFF' : '#fff' }}>
                  <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>
                    {dados.alerta && <span style={{ marginRight: '6px' }}>⚠️</span>}
                    {nome}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: MW.navy }}>{dados.vendas.toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                    <span style={{ backgroundColor: STATUS_COLORS[dados.status] || '#f5f5f5', color: STATUS_TEXT[dados.status] || '#333', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>
                      {dados.status}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>{dados.encCarrinho}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'right' }}>
          * Somente deals com status "Negócio Faturado" no HubSpot · Datas de encerramento extraídas do Roadmap GTM 26/27
        </p>
      </div>
    </div>
  )
}

function SectionHeader({ icon, title, count, warning }: { icon: string; title: string; count: number; warning?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#1a1a1a' }}>{title}</h2>
      <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 400 }}>({count} curso{count !== 1 ? 's' : ''})</span>
      {warning && (
        <span style={{ fontSize: '11px', color: MW.mid, backgroundColor: '#EEF3FA', padding: '2px 10px', borderRadius: '20px', border: `1px solid ${MW.frost}`, fontWeight: 600 }}>{warning}</span>
      )}
    </div>
  )
}
