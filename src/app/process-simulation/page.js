'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const page = () => {
    const params = useSearchParams()
    const id = params.get('id')

    const [data, setData] = useState(null)
    const [processes, setProcesses] = useState(null)

    const [TH, setTH] = useState(0)

    useEffect(() => {
        fetch(`/api/db?id=${id}`)
            .then(res => res.json())
            .then(d => {
                setData(d.catalogbyid[0])
                setProcesses(d.processesbyid)
            })
    }, [id])

    const simulation = () =>{

    }

    return (
        <div onClick={() => {
            console.log(processes)
        }} className='simulation-container'>
            <div>
                <div>Nombre del catalogo: {data && data.catalog_name} </div>
                <div>Numero de procesos guardados: {data && data.process_catalog} </div>
            </div>

            <div className='table-container'>
                <div className='table-item'>PID</div>
                <div className='table-item'>Nombre</div>
                <div className='table-item'>Usuario</div>
                <div className='table-item'>Descripción</div>
                <div className='table-item'>Prioridad</div>

                {processes && processes.map(p => (
                    <React.Fragment key={p.id}>
                        <div className='table-item'>{p.pid}</div>
                        <div className='table-item'>{p.name}</div>
                        <div className='table-item'>{p.user}</div>
                        <div className='table-item'>{p.description}</div>
                        <div className='table-item'>{p.priority}</div>
                    </React.Fragment>
                ))}
            </div>

            Listado de ejecuciones

            <div className='report-table-container'>
                <div className='table-item'>P</div>
                <div className='table-item'>T.L</div>
                <div className='table-item'>R</div>
                <div className='table-item'>PR</div>
                <div className='table-item'>TR</div>
                <div className='table-item'>TF</div>

                {processes && processes.map((p,index) => (
                    <React.Fragment key={p.id}>
                        <div className='table-item'>{p.name}</div>
                        <div className='table-item'>{index}</div>
                        <div className='table-item'>{p.description.length}</div>
                        <div className='table-item'>{p.priority}</div>
                        <div className='table-item'>-</div>
                        <div className='table-item'>-</div>
                    </React.Fragment>
                ))}
            </div>
            o
            Listado de procesos no expulsivos

            <div className='report-table-container'>
                <div className='table-item'>PID</div>
                <div className='table-item'>Nombre</div>
                <div className='table-item'>Usuario</div>
                <div className='table-item'>Descripción</div>
                <div className='table-item'>Prioridad</div>

                {processes && processes.map(p => (
                    <React.Fragment key={p.id}>
                        <div className='table-item'>aqui</div>
                    </React.Fragment>
                ))}
            </div>

            <div className='user-handle'>
                <div className='input-container'>
                    <div>TH (tiempo de rafaga) m/s<input type='number'></input></div>
                    <div>Quantum <input></input></div>
                </div>


                <button className='button' style={{alignSelf:"center"}}>Simular</button>
            </div>



        </div>


    )
}

export default page