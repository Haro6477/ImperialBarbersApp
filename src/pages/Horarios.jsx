import React, { useEffect, useState } from 'react'
import { getChequeos, getChequeosHoy, getEmpleados, guardarHorario } from '../funciones'

const Horarios = ({ user, empleados, horarios, setHorarios }) => {

  const [idBarber, setIdBarber] = useState('')
  const [nombreBarber, setNombreBarber] = useState('')
  const [lunIn, setLunIn] = useState('00:00')
  const [lunOut, setLunOut] = useState('00:00')
  const [marIn, setMarIn] = useState('00:00')
  const [marOut, setMarOut] = useState('00:00')
  const [mieIn, setMieIn] = useState('00:00')
  const [mieOut, setMieOut] = useState('00:00')
  const [jueIn, setJueIn] = useState('00:00')
  const [jueOut, setJueOut] = useState('00:00')
  const [vieIn, setVieIn] = useState('00:00')
  const [vieOut, setVieOut] = useState('00:00')
  const [sabIn, setSabIn] = useState('00:00')
  const [sabOut, setSabOut] = useState('00:00')
  const [domIn, setDomIn] = useState('00:00')
  const [domOut, setDomOut] = useState('00:00')

  const [chequeosHoy, setChequeosHoy] = useState([])
  const [chequeos, setChequeos] = useState([])

  useEffect(() => {
    obtenerChequeosHoy()
  }, [])

  const obtenerChequeosHoy = () => {
    getChequeosHoy(setChequeosHoy)
  }
  const obtenerChequeos = () => {
    getChequeos(setChequeos)
  }

  const openModal = (idBarber, nombreBarber) => {
    const horariosBarber = horarios.find((horario) => horario.idBarber == idBarber)

    setIdBarber(idBarber)
    setNombreBarber(nombreBarber)
    setLunIn(horariosBarber.lunIn)
    setLunOut(horariosBarber.lunOut)
    setMarIn(horariosBarber.marIn)
    setMarOut(horariosBarber.marOut)
    setMieIn(horariosBarber.mieIn)
    setMieOut(horariosBarber.mieOut)
    setJueIn(horariosBarber.jueIn)
    setJueOut(horariosBarber.jueOut)
    setVieIn(horariosBarber.vieIn)
    setVieOut(horariosBarber.vieOut)
    setSabIn(horariosBarber.sabIn)
    setSabOut(horariosBarber.sabOut)
    setDomIn(horariosBarber.domIn)
    setDomOut(horariosBarber.domOut)
  }

  return (
    <div className='container'>
      <h1 className='my-3'>HORARIOS</h1>
      <div className="table-responsive">
        <table className='table table-hover' >
          <thead>
            <tr>
              <th></th>
              <th>LUNES</th>
              <th>MARTES</th>
              <th>MIÉRCOLES</th>
              <th>JUEVES</th>
              <th>VIERNES</th>
              <th>SÁBADO</th>
              <th>DOMINGO</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              (empleado.estatus != "A") ? null
                : <tr onClick={() => openModal(empleado.id, empleado.nombre)} className='pointer' data-bs-toggle='modal' data-bs-target='#modal-horarios' key={empleado.id}>
                  <th className='text-start'>{empleado.nombre}</th>
                  <td>{horarios.length > 0 ? horarios.find((horario) => horario.idBarber == empleado.id).lunIn == '00:00:00' ? <span className='text-danger h6'>DESCANSO</span> : horarios.find((horario) => horario.idBarber == empleado.id).lunIn.substring(0, 5) + ' - ' + horarios.find((horario) => horario.idBarber == empleado.id).lunOut.substring(0, 5) : ''}</td>
                  <td>{horarios.length > 0 ? horarios.find((horario) => horario.idBarber == empleado.id).marIn == '00:00:00' ? <span className='text-danger h6'>DESCANSO</span> : horarios.find((horario) => horario.idBarber == empleado.id).marIn.substring(0, 5) + ' - ' + horarios.find((horario) => horario.idBarber == empleado.id).marOut.substring(0, 5) : ''}</td>
                  <td>{horarios.length > 0 ? horarios.find((horario) => horario.idBarber == empleado.id).mieIn == '00:00:00' ? <span className='text-danger h6'>DESCANSO</span> : horarios.find((horario) => horario.idBarber == empleado.id).mieIn.substring(0, 5) + ' - ' + horarios.find((horario) => horario.idBarber == empleado.id).mieOut.substring(0, 5) : ''}</td>
                  <td>{horarios.length > 0 ? horarios.find((horario) => horario.idBarber == empleado.id).jueIn == '00:00:00' ? <span className='text-danger h6'>DESCANSO</span> : horarios.find((horario) => horario.idBarber == empleado.id).jueIn.substring(0, 5) + ' - ' + horarios.find((horario) => horario.idBarber == empleado.id).jueOut.substring(0, 5) : ''}</td>
                  <td>{horarios.length > 0 ? horarios.find((horario) => horario.idBarber == empleado.id).vieIn == '00:00:00' ? <span className='text-danger h6'>DESCANSO</span> : horarios.find((horario) => horario.idBarber == empleado.id).vieIn.substring(0, 5) + ' - ' + horarios.find((horario) => horario.idBarber == empleado.id).vieOut.substring(0, 5) : ''}</td>
                  <td>{horarios.length > 0 ? horarios.find((horario) => horario.idBarber == empleado.id).sabIn == '00:00:00' ? <span className='text-danger h6'>DESCANSO</span> : horarios.find((horario) => horario.idBarber == empleado.id).sabIn.substring(0, 5) + ' - ' + horarios.find((horario) => horario.idBarber == empleado.id).sabOut.substring(0, 5) : ''}</td>
                  <td>{horarios.length > 0 ? horarios.find((horario) => horario.idBarber == empleado.id).domIn == '00:00:00' ? <span className='text-danger h6'>DESCANSO</span> : horarios.find((horario) => horario.idBarber == empleado.id).domIn.substring(0, 5) + ' - ' + horarios.find((horario) => horario.idBarber == empleado.id).domOut.substring(0, 5) : ''}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h1 className='my-3'>CHECKS</h1>
      <div className="bg-dark px-1 py-1 rounded mb-5">
        <div className="table-responsive">
          <table className="table table-dark ">
            <thead>
              <tr>
                <th></th>
                <th>Entrada</th>
                <th>Descanso</th>
                <th>Fin descanso</th>
                <th>Salida</th>
              </tr>
            </thead>
            <tbody>
              {chequeosHoy.map((check, index) => (
                <tr key={index}>
                  <td>{check.nombre}</td>
                  <td>{check.entrada}</td>
                  <td>{check.comidaInicio}</td>
                  <td>{check.comidaFin}</td>
                  <td>{check.salida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {chequeos.length > 0
        ?
        <div className="table-responsive mb-5">
          <table className="table table-secondary ">
            <thead>
              <tr>
                <th></th>
                <th>Día</th>
                <th>Entrada</th>
                <th>Descanso</th>
                <th>Fin descanso</th>
                <th>Salida</th>
              </tr>
            </thead>
            <tbody>
              {chequeos.map((check, index) => (
                <tr key={index}>
                  <td>{check.nombre}</td>
                  <td>{new Date(check.dia).toLocaleDateString('es-mx', { weekday: "long", day: "numeric", month: "short" })}</td>
                  <td>{check.entrada}</td>
                  <td>{check.comidaInicio}</td>
                  <td>{check.comidaFin}</td>
                  <td>{check.salida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        : <button onClick={() => obtenerChequeos()}
          className='btn btn-dark mb-5'>Mostrar 50 más
        </button>
      }


      {/* ------ MODAL ------ */}
      <div id='modal-horarios' className="modal fade" aria-hidden='true'>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 id='lblTitleS'>Horario de {nombreBarber}</h4>
              <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col">Día</div>
                <div className="col">Entrada</div>
                <div className="col">Salida</div>
              </div>

              <div className="row my-2">
                <div className="col align-self-center">LUNES</div>
                <div className="col">
                  <input type="time" className="form-control" id='lunIn' value={lunIn}
                    onChange={(e) => setLunIn(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input type="time" className="form-control" id='lunOut' value={lunOut}
                    onChange={(e) => setLunOut(e.target.value)}
                  />
                </div>
              </div>
              <div className="row my-2">
                <div className="col align-self-center">MARTES</div>
                <div className="col">
                  <input type="time" className="form-control" id='marIn' value={marIn}
                    onChange={(e) => setMarIn(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input type="time" className="form-control" id='marOut' value={marOut}
                    onChange={(e) => setMarOut(e.target.value)}
                  />
                </div>
              </div>
              <div className="row my-2">
                <div className="col align-self-center">MIÉRCOLES</div>
                <div className="col">
                  <input type="time" className="form-control" id='mieIn' value={mieIn}
                    onChange={(e) => setMieIn(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input type="time" className="form-control" id='mieOut' value={mieOut}
                    onChange={(e) => setMieOut(e.target.value)}
                  />
                </div>
              </div>
              <div className="row my-2">
                <div className="col align-self-center">JUEVES</div>
                <div className="col">
                  <input type="time" className="form-control" id='jueIn' value={jueIn}
                    onChange={(e) => setJueIn(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input type="time" className="form-control" id='jueOut' value={jueOut}
                    onChange={(e) => setJueOut(e.target.value)}
                  />
                </div>
              </div>
              <div className="row my-2">
                <div className="col align-self-center">VIERNES</div>
                <div className="col">
                  <input type="time" className="form-control" id='vieIn' value={vieIn}
                    onChange={(e) => setVieIn(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input type="time" className="form-control" id='vieOut' value={vieOut}
                    onChange={(e) => setVieOut(e.target.value)}
                  />
                </div>
              </div>
              <div className="row my-2">
                <div className="col align-self-center">SÁBADO</div>
                <div className="col">
                  <input type="time" className="form-control" id='sabIn' value={sabIn}
                    onChange={(e) => setSabIn(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input type="time" className="form-control" id='sabOut' value={sabOut}
                    onChange={(e) => setSabOut(e.target.value)}
                  />
                </div>
              </div>
              <div className="row my-2">
                <div className="col align-self-center">DOMINGO</div>
                <div className="col">
                  <input type="time" className="form-control" id='domIn' value={domIn}
                    onChange={(e) => setDomIn(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input type="time" className="form-control" id='domOut' value={domOut}
                    onChange={(e) => setDomOut(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button id='btnCerrarModalS' type='button' className="btn btn-secondary me-3 my-3" data-bs-dismiss='modal'>
                  <i className="fa-solid fa-xmark me-2" />Cerrar
                </button>
                <button disabled={!user.permisos.includes('editar')} onClick={() => guardarHorario(horarios, setHorarios, lunIn, lunOut, marIn, marOut, mieIn, mieOut, jueIn, jueOut, vieIn, vieOut, sabIn, sabOut, domIn, domOut, idBarber)} id='btnGuardar' className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk me-2" />Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Horarios