'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
export default function Home() {

  const [data, setData] = useState([])

  const router = useRouter()

  useEffect(() => {
    fetch('/api/db')
      .then(res => res.json())
      .then(d => setData(d.catalog))
  }, [])

  return (
    <div>
      <div className="catalog-container">

        {data.map(p => (
          <div className="catalog-item" key={p.id}>

            <div>Nombre: {p.catalog_name} </div>
            <div>Cantidad de procesos: {p.process_catalog}</div>

            <button
              style={{ alignSelf: 'center', marginTop: 10 }}
              className="button"
              onClick={() => {
                router.push(`/process-simulation?id=${p.id}`)
              }}
            >
              Abrir
            </button>
            
          </div>
        ))}

      </div>
    </div>
  );
}
