'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useRouter } from 'next/navigation'
const Page = () => {
    const id = 3
    const [data, setData] = useState(null)
    const [processes, setProcesses] = useState(null)
    const [TH, setTH] = useState(10)
    const [quantum, setQuantum] = useState(4)
    const [runningProcesses, setRunningProcesses] = useState([])
    const [activeProcess, setActiveProcess] = useState([])
    const [finishedProcesses, setFinishedProcesses] = useState([])
    const [currentProcess, setCurrentProcess] = useState({})
    const [waitingProcesses, setWaitingProcesses] = useState([])

    const [waiting, setWaiting] = useState([])

    const [finishedTime, setFinishedTime] = useState([])

    const [startedProcess, setStartedProcess] = useState([])

    const [isFinished, setIsFinished] = useState(false)

    const [state, setState] = useState([])

    const router = useRouter()

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
        setFinishedTime([])
        setStartedProcess([])
        setWaiting([])

        let count = 0

        let current = {}

        const newQueue = processes.map((p, index) => ({
            pid: p.pid,
            TL: index,
            R: p.description.length,
            priority: p.priority,
            state: "No ha llegado",
            TR: TH * p.description.length,
            executions: 0,
            P: "P" + (index + 1),
            name: p.name
        }))

        setStartedProcess(newQueue)

        setWaitingProcesses(newQueue)



        let totalR = newQueue.reduce((acc, p) => acc + p.R, 0)

        while (totalR > 0) {

            for (let i = 0; i < newQueue.length; i++) {


                const ap = newQueue[i]
                if (newQueue[i].R > 0) {

                    setActiveProcess(p => {
                        const sinDuplicado = p.filter(item => item.pid !== newQueue[i].pid)
                        return [newQueue[i], ...sinDuplicado]
                    })
                    setRunningProcesses(p => p.filter(item => item.pid !== newQueue[i].pid))
                    setCurrentProcess(newQueue[i])
                    current = newQueue[i]
                    if (newQueue[i].pid === current.pid) setWaiting(p => p.filter(item => item.pid !== newQueue[i].pid))

                }

                let j = 1

                let idp = newQueue[i].pid
                if (newQueue[i].priority === 1) {


                    if (newQueue[i].R > 0) newQueue[i].executions++
                    newQueue[i].state = "En ejecución"

                    while (quantum >= j) {

                        if (newQueue[i].R <= 0) break

                        newQueue[i].state = "En ejecución"


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
                            setFinishedProcesses(p => [...p, newQueue[i]])

                            setActiveProcess(p => p.filter(item => item.pid !== newQueue[i].pid))
                            setActiveProcess(p => p.filter(item => item.pid !== newQueue[i].pid))

                            setWaiting(p => p.filter(item => item.pid !== newQueue[i].pid))

                            setFinishedTime(p => [...p, { pid: newQueue[i].pid, count }])
                        }


                        await sleep(TH)
                    }

                    if (newQueue[i].R > 0) setWaiting(p => p.some(x => x.pid === newQueue[i].pid) ? p : [...p, newQueue[i]])
                    


                } else if (newQueue[i].priority === 0) {

                    if (newQueue[i].R > 0) newQueue[i].executions++

                    while (newQueue[i].R > 0) {

                        if (newQueue[i].R <= 0) break

                        newQueue[i].state = "En ejecución"

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
                            setFinishedProcesses(p => [...p, newQueue[i]])
                            setActiveProcess(p => p.filter(item => item.pid !== newQueue[i].pid))
                            setFinishedTime(p => [...p, { pid: newQueue[i].pid, count }])

                            setWaiting(p => p.filter(item => item.pid !== newQueue[i].pid))
                        }

                        await sleep(TH)
                    }

                    if (newQueue[i].R > 0) setWaiting(p => p.some(x => x.pid === newQueue[i].pid) ? p : [...p, newQueue[i]])

                }
            }

            totalR = newQueue.reduce((acc, p) => acc + p.R, 0)

        }

        setCurrentProcess({})
        setIsFinished(true)

    }

    const MakeTable = () => {
        const [data, setData] = useState([
            { name: 'P1', value: 3 },
            { name: 'P2', value: 7 },
            { name: 'P3', value: 5 },
            { name: 'P4', value: 9 }
        ])

        useEffect(() => {
            if (!startedProcess) return
            const newData = startedProcess.map(d => ({
                name: d.P,
                value: d.TR
            }))
            setData(newData)
        }, [startedProcess])



        return (
            <LineChart width={data.length * 38} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
        )

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
                    En espera

                    <div className='result-list'>
                        {waiting && waiting.map((ap, index) => (
                            <React.Fragment key={ap.pid}>
                                <div>pid: {ap.pid} R: {ap.R} </div>
                            </React.Fragment>
                        ))}
                    </div>

                </div>

                <div className='result-item'>
                    Ejecucion

                    <div className='result-list'>
                        {currentProcess && <div>pid: {currentProcess.pid} R: {currentProcess.R} </div>}
                    </div>

                </div>
                <div className='result-item'>
                    Listo
                    <div className='result-list'>
                        {runningProcesses && runningProcesses.map((rp, index) => (
                            <React.Fragment key={rp.pid}>
                                <div>pid: {rp.pid} R: {rp.R}  </div>
                            </React.Fragment>

                        ))}
                    </div>
                </div>
                <div className='result-item'>
                    Terminado
                    <div className='result-list'>
                        {finishedProcesses && finishedProcesses.map((fp, index) => (
                            <React.Fragment key={fp.pid}>
                                <div>pid: {fp.pid} R: {fp.R} </div>
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
                <div className='table-item'></div>
                <div className='table-item'>P</div>
                <div className='table-item'>T.L</div>
                <div className='table-item'>R</div>
                <div className='table-item'>PR</div>
                <div className='table-item'>TR</div>
                <div className='table-item'>TF</div>
                <div className='table-item'>Numero de ejecuciones</div>

                {processes && processes.map((p, index) => (
                    <React.Fragment key={p.id}>
                        <div className='table-item'>{startedProcess && startedProcess[index]?.P && startedProcess[index]?.P}</div>
                        <div className='table-item'>{p.name}</div>
                        <div className='table-item'>{index}</div>
                        <div className='table-item'>{p.description.length}</div>
                        <div className='table-item'>{p.priority}</div>
                        <div className='table-item'>{startedProcess && startedProcess[index]?.TR}</div>
                        <div className='table-item'>{startedProcess && startedProcess[index]?.executions && startedProcess[index]?.executions * quantum}</div>
                        <div className='table-item'>{startedProcess && startedProcess[index]?.executions && startedProcess[index]?.executions}</div>
                    </React.Fragment>
                ))}
            </div>
            o
            Listado de procesos no expulsivos

            <div className='report-table-container'>
                <div className='table-item'></div>
                <div className='table-item'>P</div>
                <div className='table-item'>T.L</div>
                <div className='table-item'>R</div>
                <div className='table-item'>PR</div>
                <div className='table-item'>TR</div>
                <div className='table-item'>TF</div>
                <div className='table-item'>Numero de ejecuciones</div>

                {processes && processes.map((p, index) => (
                    p.priority === 0 && <React.Fragment key={p.id}>
                        <div className='table-item'>{startedProcess && startedProcess[index]?.P && startedProcess[index]?.P}</div>
                        <div className='table-item'>{p.name}</div>
                        <div className='table-item'>{index}</div>
                        <div className='table-item'>{p.description.length}</div>
                        <div className='table-item'>{p.priority}</div>
                        <div className='table-item'>{startedProcess && startedProcess[index]?.TR}</div>
                        <div className='table-item'>{startedProcess && startedProcess[index]?.executions && startedProcess[index]?.executions * quantum}</div>
                        <div className='table-item'>{startedProcess && startedProcess[index]?.executions && startedProcess[index]?.executions}</div>
                    </React.Fragment>
                ))}
            </div>


            {isFinished && <MakeTable></MakeTable>}

            <div style={{ position: "absolute", top: 40, left: 40, fontSize: 50, color: "gray", cursor: "pointer" }}
                onClick={() => {
                    router.push('/')
                }}
            >⬅</div>
        </div>


    )
}

export default Page