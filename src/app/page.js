'use client'
import { useEffect, useState } from "react";
export default function Home() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/db')
      .then(res => res.json())
      .then(setData)
  }, [])
  return (
    <div>
      <div className="catalog-container">

        {data.map(p => (
          <div className="catalog-item" key={p.id}>

            <div>Nombre: {p.catalog_name} </div>
            <div>Cantidad de procesos: {p.process_catalog}</div>

            <button style={{alignSelf:'center', marginTop:10}} className="button">Abrir</button>
            </div>
        ))}

      </div>
    </div>
  );
}
