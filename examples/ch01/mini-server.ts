import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'

// สร้าง Web Server ด้วย node:http
const server = createServer((req, res) => {
    console.log(`[server] ${req.method} ${req.url}`)

    if (req.method === 'GET' && req.url === '/hello') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Hello from node:http' }))
        return
    }

    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found' }))
})

// ให้ระบบเลือกพอร์ตที่ว่าง
server.listen(0, async () => {
    const { port } = server.address() as AddressInfo
    const baseUrl = `http://localhost:${port}`

    console.log(`[server] listening on ${baseUrl}`)

    // ทดสอบเรียก API ที่มีอยู่
    const ok = await fetch(new URL('/hello', baseUrl))
    console.log('[client] status:', ok.status)
    console.log('[client] content-type:', ok.headers.get('content-type'))
    console.log('[client] body:', await ok.json())

    // ทดสอบเรียก API ที่ไม่มีอยู่
    const notFound = await fetch(new URL('/coffees', baseUrl))
    console.log('[client] status:', notFound.status)
    console.log('[client] body:', await notFound.json())

    // ปิดเซิร์ฟเวอร์
    server.close(() => console.log('[server] closed'))
})
