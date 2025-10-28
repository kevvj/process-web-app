'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const page = () => {
    const params = useSearchParams()
    const id = params.get('id')

    const [data, setData] = useState(null)
    const [processes, setProcesses] = useState(null)

    const [TH, setTH] = useState(100)
    const [quantum, setQuantum] = useState(4)

    const [runningProcesses, setRunningProcesses] = useState([])

    const [activeProcess, setActiveProcess] = useState([])

    const [finishedProcesses, setFinishedProcesses] = useState([])

    const [currentProcess, setCurrentProcess] = useState({})

    const [waitingProcesses, setWaitingProcesses] = useState([])

    useEffect(() => {
        fetch(`/api/db?id=${id}`)
            .then(res => res.json())
            .then(d => {
                setData(d.catalogbyid[0])
                setProcesses(d.processesbyid)
            })
    }, [id])

    const simulation = async () => {

        setActiveProcess([])
        setCurrentProcess({})
        setFinishedProcesses([])
        setRunningProcesses([])
        setWaitingProcesses([])

        let count = 0

        const newQueue = processes.map((p, index) => ({
            pid: p.pid,
            TL: index,
            R: p.description.length,
            priority: p.priority,
            state: "En espera"
        }))

        setWaitingProcesses(newQueue)

        let totalR = newQueue.reduce((acc, p) => acc + p.R, 0)

        while (totalR > 0) {

            for (let i = 0; i < newQueue.length; i++) {

                const ap = newQueue[i]


                if (newQueue[i].R > 0) {
                    console.log("array normal", newQueue[i])

                    setActiveProcess(p => {
                        const sinDuplicado = p.filter(item => item.pid !== newQueue[i].pid)
                        return [newQueue[i], ...sinDuplicado]
                    })

                    setRunningProcesses(p => p.filter(item => item.pid !== newQueue[i].pid))

                    setCurrentProcess(newQueue[i])

                    newQueue[i].state = "En ejecución"

                }

                let j = 1

                if (newQueue[i].priority === 1) {
                    while (quantum >= j) {

                        if (newQueue[i].R <= 0) break


                        setWaitingProcesses(p => p.filter(d => d.TL >= count))

                        setRunningProcesses(p => {
                            const nuevos = newQueue.filter(
                                d => d.TL <= count && d.R > 0 && d.state !== "En ejecución" && !p.some(x => x.pid === d.pid)
                            )
                            return [...p, ...nuevos]
                        })




                        count++

                        const newR = Math.max(ap.R - 1, 0)

                        newQueue[i].R = newR

                        j++

                        if (newQueue[i].R <= 0) {
                            newQueue[i].state = "Finalizado"
                            setFinishedProcesses(p => [...p, newQueue[i]])

                            setActiveProcess(p => p.filter(item => item.pid !== newQueue[i].pid))
                        }

                        console.log("el array cambió", newQueue[i])

                        await sleep(TH)
                    }
                } else if (newQueue[i].priority === 0) {

                    while (newQueue[i].R > 0) {

                        if (newQueue[i].R <= 0) break

                        newQueue[i].R--

                        setWaitingProcesses(p => p.filter(d => d.TL >= count))

                        setRunningProcesses(p => {
                            const nuevos = newQueue.filter(
                                d => d.TL <= count && d.R > 0 && d.state !== "En ejecución" && !p.some(x => x.pid === d.pid)
                            )
                            return [...p, ...nuevos]
                        })




                        count++

                        const newR = Math.max(ap.R - 1, 0)

                        newQueue[i].R = newR

                        j++

                        if (newQueue[i].R <= 0) {
                            newQueue[i].state = "Finalizado"
                            setFinishedProcesses(p => [...p, newQueue[i]])

                            setActiveProcess(p => p.filter(item => item.pid !== newQueue[i].pid))
                        }

                        console.log("el array cambió", newQueue[i])

                        await sleep(TH)
                    }
                }

            }

            totalR = newQueue.reduce((acc, p) => acc + p.R, 0)

        }

        setCurrentProcess({})

    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    return (
        <div className='simulation-container'>
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
                    Ejecucion

                    <div className='result-list'>
                        {activeProcess && activeProcess.map(ap => (
                            <React.Fragment key={ap.pid}>
                                <div>pid: {ap.pid} R: {ap.R}</div>
                            </React.Fragment>
                        ))}
                    </div>

                </div>
                <div className='result-item'>
                    Listo
                    <div className='result-list'>
                        {runningProcesses && runningProcesses.map(rp => (
                            <React.Fragment key={rp.pid}>
                                <div>pid: {rp.pid} R: {rp.R}</div>
                            </React.Fragment>

                        ))}
                    </div>
                </div>
                <div className='result-item'>
                    Terminado
                    <div className='result-list'>
                        {finishedProcesses && finishedProcesses.map(fp => (
                            <React.Fragment key={fp.pid}>
                                <div>pid: {fp.pid} R: {fp.R}</div>
                            </React.Fragment>

                        ))}
                    </div>
                </div>

                <div className='result-item'>
                    No han llegado
                    <div className='result-list'>
                        {waitingProcesses && waitingProcesses.map(wp => (
                            <React.Fragment key={wp.pid}>
                                <div>pid: {wp.pid} R: {wp.R}</div>
                            </React.Fragment>

                        ))}
                    </div>
                </div>


            </div>

            <div>Proceso que se está ejecutando: {currentProcess.pid}</div>

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