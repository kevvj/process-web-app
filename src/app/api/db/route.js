// route.js
import mysql from 'mysql2/promise'

export async function GET() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'process-management'
  })

  const [rows] = await connection.execute('SELECT * FROM catalog')
  return new Response(JSON.stringify(rows), { status: 200 })
}
