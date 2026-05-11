'use client'

import { useState } from 'react'

export default function Home() {
  const [search, setSearch] = useState('')

  const produtos: Record<string, {vendas: number, booked: number, total: number, ticket: number}> = {
    "Extensivo Enamed 2026": {"vendas": 2, "booked": 0, "total": 24116.22, "ticket": 12058.11},
    "Extensivo Base/Programado 2026": {"vendas": 1, "booked": 0, "total": 19917.00, "ticket": 19917.00},
    "Extensivo Programado 2026": {"vendas": 2, "booked": 1, "total": 19917.00, "ticket": 9958.50},
    "Extensivo ENAMED 2026": {"vendas": 1, "booked": 0, "total": 11455.20, "ticket": 11455.20},
  }

  const totalVendas = Object.values(produtos).reduce((sum, p) => sum + p.vendas, 0)
  const totalBooked = Object.values(produtos).reduce((sum, p) => sum + p.booked, 0)
  const totalArrecadado = Object.values(produtos).reduce((sum, p) => sum + p.total, 0)
  const filtered = Object.entries(produtos).filter(([nome]) => nome.toLowerCase().includes(search.toLowerCase())).sort((a, b) => b[1].total - a[1].total)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ backgroundColor: '#00205B', color: '#fff', padding: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Medway Dashboard</h1>
        <p style={{ margin: '0.5rem 0 0', fontSize: '14px', opacity: 0.9 }}>Dados HubSpot • 11/05/2026</p>
      </header>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Total de vendas</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0C447C' }}>{totalVendas}</div>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Booked Sales</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27500A' }}>{totalBooked}</div>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Total arrecadado</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>R$ {(totalArrecadado / 1000).toFixed(0)}k</div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1.5rem' }}
        />

        <div style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px' }}>Produto</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>Vendas</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>Booked</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(([produto, dados]) => (
                <tr key={produto} style={{ borderBottom: '1px solid #eee', fontSize: '12px' }}>
                  <td style={{ padding: '12px' }}>{produto}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{dados.vendas}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{dados.booked}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>R$ {dados.total.toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}