import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  let intervalId: NodeJS.Timeout

  const stream = new ReadableStream({
    start(controller) {
      let count = 0
      const sendEvent = () => {
        count++
        const event = {
          id: count,
          type: 'metric',
          message: `Real-time update #${count}`,
          value: Math.floor(Math.random() * 1000),
          timestamp: new Date().toISOString(),
        }
        const data = `data: ${JSON.stringify(event)}\n\n`
        controller.enqueue(new TextEncoder().encode(data))
      }

      // Send first event immediately
      sendEvent()
      // Send subsequent events every 2 seconds
      intervalId = setInterval(sendEvent, 2000)
    },
    cancel() {
      clearInterval(intervalId)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
