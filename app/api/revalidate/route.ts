import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Aceita requisições do Vercel Cron (header automático) ou com token manual
  const isVercelCron = req.headers.get('x-vercel-cron') === '1'
  const secret = req.nextUrl.searchParams.get('secret')
  const validSecret = process.env.REVALIDATE_TOKEN && secret === process.env.REVALIDATE_TOKEN

  if (!isVercelCron && !validSecret) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  revalidatePath('/')
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() })
}
