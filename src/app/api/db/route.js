// route.js
import mysql from 'mysql2/promise'

export async function GET(req) {

  const id = req.nextUrl.searchParams.get('id')

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'process-management'
  })

  

  const [catalog] = await connection.execute('SELECT * FROM catalog')
  const [process] = await connection.execute('SELECT * FROM process')

  const [catalogbyid] = await connection.execute(
    'SELECT * FROM catalog WHERE id = ?',
    [id]
  )
  const [processesbyid] = await connection.execute(
    'SELECT * FROM process WHERE catalog_id = ?',
    [id]
  )

  await connection.end() 


  return new Response(JSON.stringify({ catalog, process, catalogbyid, processesbyid }), { status: 200 })
}
