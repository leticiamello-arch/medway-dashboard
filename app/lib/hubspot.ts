const HUBSPOT_BASE = 'https://api.hubapi.com'
const STAGE_FATURADO = '95726246'

interface HubSpotDeal {
  properties: { amount: string | null }
}
interface HubSpotResponse {
  results: HubSpotDeal[]
  paging?: { next?: { after: string } }
}

export async function fetchCourseDeals(
  searchTerms: string[]
): Promise<{ vendas: number; bookedTotal: number }> {
  const token = process.env.HUBSPOT_TOKEN
  if (!token) return { vendas: 0, bookedTotal: 0 }

  const filters = [
    { propertyName: 'dealstage', operator: 'EQ', value: STAGE_FATURADO },
    ...searchTerms.map(term => ({
      propertyName: 'dealname',
      operator: 'CONTAINS_TOKEN',
      value: term,
    })),
  ]

  let after: string | undefined
  let vendas = 0
  let bookedTotal = 0

  do {
    const body: Record<string, unknown> = {
      filterGroups: [{ filters }],
      properties: ['amount'],
      limit: 200,
    }
    if (after) body.after = after

    const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals/search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error(`[HubSpot] ${res.status} ao buscar "${searchTerms.join(', ')}"`)
      break
    }

    const data = (await res.json()) as HubSpotResponse
    vendas += data.results.length
    for (const deal of data.results) {
      bookedTotal += parseFloat(deal.properties.amount ?? '0') || 0
    }
    after = data.paging?.next?.after
  } while (after)

  return { vendas, bookedTotal }
}
