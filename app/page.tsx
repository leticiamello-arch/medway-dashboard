import { COURSE_CONFIG } from './lib/courseConfig'
import { fetchCourseDeals } from './lib/hubspot'
import type { Curso } from './lib/types'
import DashboardClient from './components/DashboardClient'

// Revalida o cache uma vez por dia (ISR)
export const revalidate = 86400

export default async function Home() {
  const hasToken = Boolean(process.env.HUBSPOT_TOKEN)

  const entries = await Promise.all(
    Object.entries(COURSE_CONFIG).map(async ([nome, config]) => {
      let vendas: number
      let bookedTotal: number

      if (hasToken) {
        const result = await fetchCourseDeals(config.searchTerms)
        vendas      = result.vendas
        bookedTotal = result.bookedTotal
      } else {
        vendas      = config.fallback.vendas
        bookedTotal = config.fallback.bookedTotal
      }

      const ticket = vendas > 0 && bookedTotal > 0 ? bookedTotal / vendas : 0

      const curso: Curso = {
        vendas,
        bookedTotal,
        ticket,
        status:      config.status,
        encCarrinho: config.encCarrinho,
        secao:       config.secao,
        alerta:      config.alerta,
      }

      return [nome, curso] as [string, Curso]
    })
  )

  const cursos = Object.fromEntries(entries)

  const now = new Date().toLocaleDateString('pt-BR', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
    hour:  '2-digit',
    minute:'2-digit',
    timeZone: 'America/Sao_Paulo',
  })

  return <DashboardClient cursos={cursos} updatedAt={now} />
}
