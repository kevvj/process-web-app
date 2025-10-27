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
    const [quantum, setQuantum] = useState(0)

    const [processQueue, setProcessQueue] = useState([{}])

    useEffect(() => {
        fetch(`/api/db?id=${id}`)
            .then(res => res.json())
            .then(d => {
                setData(d.catalogbyid[0])
                setProcesses(d.processesbyid)
            })
    }, [id])

    const simulation = async () => {


        const newQueue = processes.map((p, index) => ({
            id: p.pid,
            TL: index,
            R: p.description.length
        }))

        setProcessQueue(newQueue)

        let totalR = newQueue.reduce((acc, p) => acc + p.R, 0)

        console.log(totalR)

        while (totalR >= 0) {
            totalR = totalR - quantum

            setProcessQueue(prev => prev.map(obj =>
                obj.id === 1 ? { ...obj, num: 10 } : obj
            )) // aqui tengo que conseguir una forma de tener el id del que voy a modificar

            

            console.log(totalR)
            await sleep(TH)
        }

    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
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

            <div className='user-handle'>
                <div className='input-container'>
                    <div>TH (tiempo de rafaga) m/s<input
                        type='number'
                        value={TH}
                        onChange={e => {
                            setTH(e.target.value)
                        }}
                    ></input></div>
                    <div>Quantum <input
                        type='number'
                        value={quantum}
                        onChange={e => {
                            setQuantum(e.target.value)
                        }}
                    ></input></div>
                </div>


                <button className='button' style={{ alignSelf: "center" }}
                    onClick={() => {
                        simulation()
                    }}
                >Simular</button>
            </div>

            <div className='result'>
                <div className='result-item'>
                    Listado de ejecuciones

                    <div className='result-list'>

                    </div>

                </div>
                <div className='result-item'>
                    Lista de espera
                    <div className='result-list'>

                    </div>
                </div>
                <div className='result-item'>
                    Proceso terminado
                    <div className='result-list'>

                    </div>
                </div>
            </div>

            Listado de ejecuciones

            <div className='report-table-container'>
                <div className='table-item'>P</div>
                <div className='table-item'>T.L</div>
                <div className='table-item'>R</div>
                <div className='table-item'>PR</div>
                <div className='table-item'>TR</div>
                <div className='table-item'>TF</div>

                {processes && processes.map((p, index) => (
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





        </div>


    )
}

export default page