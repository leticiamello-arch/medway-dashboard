'use client'

import { useState } from 'react'

const produtos = {
  "Extensivo Enamed 2026": {"vendas": 2, "booked": 0, "total": 24116.22, "ticket": 12058.11},
  "Extensivo Base/Programado 2026": {"vendas": 1, "booked": 0, "total": 19917.00, "ticket": 19917.00},
  "Extensivo Programado 2026": {"vendas": 2, "booked": 1, "total": 19917.00, "ticket": 9958.50},
  "Extensivo ENAMED 2026": {"vendas": 1, "booked": 0, "total": 11455.20, "ticket": 11455.20},
  "Extensivo R+ CM Pro 2026": {"vendas": 2, "booked": 0, "total": 9997.00, "ticket": 4998.50},
  "MedwayFlix Performance": {"vendas": 6, "booked": 1, "total": 6394.08, "ticket": 1065.68},
  "CR Turma 2 - 10 e 11 out": {"vendas": 1, "booked": 0, "total": 4666.33, "ticket": 4666.33},
  "Reta Final TECM 2026": {"vendas": 15, "booked": 0, "total": 2218.89, "ticket": 147.93},
  "Reta Final TEGO-TPI 2026": {"vendas": 2, "booked": 0, "total": 1997.00, "ticket": 998.50},
  "PSMedway": {"vendas": 8, "booked": 0, "total": 1797.00, "ticket": 224.63},
  "Intensivo Enamed 2026": {"vendas": 4, "booked": 0, "total": 3425.03, "ticket": 856.26},
  "Extensivo Programado 3 anos 2026": {"vendas": 2, "booked": 0, "total": 0.00, "ticket": 0.00},
  "CRMedway Revalida Online 25.2": {"vendas": 1, "booked": 0, "total": 0.00, "ticket": 0.00},
  "Intensivo Revalida 26.1": {"vendas": 5, "booked": 0, "total": 2218.89, "ticket": 443.78},
  "Extensivo R+ PED Padrão-Ouro 2026 - 3 anos": {"vendas": 1, "booked": 0, "total": 0.00, "ticket": 0.00},
  "Curso de Antibióticos": {"vendas": 1, "booked": 0, "total": 565.11, "ticket": 565.11}
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value)
}

function formatCurrencyDetailed(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(value)
}

export default function Home() {
  const [search, setSearch] = useState('')

  const totalVendas = Object.values(produtos).reduce((sum, p) => sum + p.vendas, 0)
  const totalBooked = Object.values(produtos).reduce((sum, p) => sum + p.booked, 0)
  const totalArrecadado = Object.values(produtos).reduce((sum, p) => sum + p.total, 0)
  const ticketMedio = totalArrecadado / totalVendas

  const filtered = Object.entries(produtos)
    .filter(([nome]) => nome.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b[1].total - a[1].total)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#00205B', color: '#fff', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Medway Dashboard</h1>
          <p style={{ margin: '0.5rem 0 0', fontSize: '14px', opacity: 0.9 }}>Dados de vendas HubSpot | Atualizado em 11/05/2026</p>
        </div>
      </header>

      {/* Metrics */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5rem' }}>Total de vendas</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0C447C' }}>{totalVendas}</div>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5rem' }}>Booked Sales</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27500A' }}>{totalBooked}</div>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5rem' }}>Total arrecadado</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatCurrency(totalArrecadado)}</div>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5rem' }}>Ticket médio</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatCurrency(ticketMedio)}</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Buscar por produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '12px' }}>Produto</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', fontSize: '12px' }}>Vendas</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', fontSize: '12px' }}>Booked</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', fontSize: '12px' }}>Total</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', fontSize: '12px' }}>Ticket</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', fontSize: '12px' }}>Taxa</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(([produto, dados]) => {
                const taxa = dados.vendas > 0 ? Math.round((dados.booked / dados.vendas) * 100) : 0
                return (
                  <tr key={produto} style={{ borderBottom: '1px solid #eee', fontSize: '12px' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{produto}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{dados.vendas}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '500' }}>{dados.booked}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(dados.total)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{formatCurrencyDetailed(dados.ticket)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: taxa > 0 ? '#f0fdf4' : '#fef3c7', fontWeight: '500' }}>{taxa}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Nenhum produto encontrado
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
          <p>Dashboard Medway © 2026 | Dados em tempo real do HubSpot</p>
          <p>Powered by Vercel</p>
        </div>
      </div>
    </div>
  )
}
