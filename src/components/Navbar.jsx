import { ButtonOutline } from "./ButtonOutline"
import { ButtonPlus } from "./ButtonPlus"
import React, { useState, useEffect } from 'react'
import '../estilos/navbar.css'
import { useNavigate } from "react-router-dom"
import { ButtonPill } from "./ButtonPill"
import { ButtonPlusActive } from "./ButtonPlusActive"
import { showAlert, addCliente, addMovimiento, getEmpleado, iniciarDescanso, finalizarDescanso, registrarSalida } from '../funciones'
import axios from "axios"


export const Navbar = ({ logout, funciones, estados, user, clientes, setClientes, movimientos, setMovimientos, getCaja}) => {
  const server = import.meta.env.VITE_SERVER
  const municipio = import.meta.env.VITE_MUNICIPIO

  const [nombreCliente, setNombreCliente] = useState("")
  const [telefonoCliente, setTelefonoCliente] = useState("")
  const [pts, setPts] = useState(0)
  const [genero, setGenero] = useState('')
  const [fechaNacimientoCliente, setFechaNacimientoCliente] = useState('')
  const [codigoQR, setCodigoQR] = useState("")
  const [conceptoIngreso, setConceptoIngreso] = useState("")
  const [conceptoRetiro, setConceptoRetiro] = useState("")
  const [cantidadIngreso, setCantidadIngreso] = useState("")
  const [cantidadRetiro, setCantidadRetiro] = useState("")
  const [foto, setFoto] = useState('/src/images/barber-profile.webp')

  const [empleado, setEmpleado] = useState("")

  const [descanso, setDescanso] = useState(false)
  const [descansoFin, setDescansoFin] = useState(false)
  // const [horaDescanso, setHoraDescanso] = useState("00:00:00")
  const [tiempo, setTiempo] = useState("00:00")

  const checkHombre = document.getElementById('checkHombre')
  const btnIngreso = document.getElementById('btnIngreso')
  const btnRetiro = document.getElementById('btnRetiro')
  const dropdown = document.getElementById('navbarDropdown')

  let horaDescanso = "00:00:00"

  useEffect(() => {
    getEmpleado(user.id, setEmpleado)
    getDescanso()
  }, [])

  useEffect(() => {
    mostrarFoto()
  }, [foto])

  const actualizarTiempo = () => {
    const aux = setInterval(() => {
      const horaActual = new Date();
      let fechaHoraDesc = new Date()
      fechaHoraDesc.setHours(horaDescanso.split(":")[0])
      fechaHoraDesc.setMinutes(horaDescanso.split(":")[1])
      fechaHoraDesc.setSeconds(horaDescanso.split(":")[2])
      fechaHoraDesc.setMilliseconds(0)
      const diferencia = horaActual.getTime() - (fechaHoraDesc).getTime()
      const segundos = String(Math.floor(diferencia / 1000) % 60).padStart(2, '0')
      const minutos = String(Math.floor(diferencia / 60000) % 60).padStart(2, '0')
      const horas = String(Math.floor(diferencia / 3600000) % 24).padStart(2, '0')

      if (horas > 0) {
        setTiempo(horas + ":" + minutos + ":" + segundos)
      } else {
        setTiempo(minutos + ":" + segundos)
      }
    }, 1000)
  }

  const mostrarFoto = () => {
    fetch(`${server}/foto-empleado/${user.id}`)
      .then(res => res.json())
      .then(res => setFoto(server + '/' + res))
      .catch(err => {
        console.log(err)
      })
  }

  const getDescanso = () => {
    axios.get(`${server}/descanso/${user.id}`).then((res) => {
      try {
        if (res.data[0].comidaInicio) {
          if (res.data[0].comidaFin) {
            setDescanso(true)
            setDescansoFin(true)
          } else {
            setDescanso(true)
            horaDescanso = (res.data[0].comidaInicio)
            actualizarTiempo()
          }
        }
      } catch (error) {
        console.log('ERROR: ' + error)
      }
    })
  }

  const setBtn = ((btnActive) => {
    for (let item in funciones) {
      funciones[item](false)
    }
    btnActive(true)
  })

  const openModal = () => {
    document.getElementById('title').className = "h4 text-success"
    setNombreCliente('')
    setTelefonoCliente('')
    setFechaNacimientoCliente('')
    setGenero('')
    setPts(0)
    setGenero('H')
    window.setTimeout(function () {
      checkHombre.checked = true;
      document.getElementById('name').focus();
    }, 500)
  }

  const validar = () => {
    if (nombreCliente.trim() == '') {
      showAlert('Escribe el nombre del cliente', 'warning')
    } else {
      addCliente(nombreCliente, telefonoCliente, pts, genero, fechaNacimientoCliente, codigoQR, municipio, clientes, setClientes)
      document.getElementById('btnCerrar').click()
    }
  }

  const setIngreso = () => {
    btnIngreso.click()
    dropdown.click()
    addMovimiento(conceptoIngreso, cantidadIngreso, user.id, empleado.nombre, movimientos, setMovimientos, getCaja)
  }
  const setRetiro = () => {
    btnRetiro.click()
    dropdown.click()
    addMovimiento(conceptoRetiro, -cantidadRetiro, user.id, empleado.nombre, movimientos, setMovimientos, getCaja)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-navbar">
      <div className="container-fluid py-3 ">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="row collapse navbar-collapse " id="navbarSupportedContent">
          <div className="col-sm-11 col-md-10">
            <ul className="navbar-nav d-flex justify-content-evenly">
              <li onClick={() => { setBtn(funciones.setBtnVenta) }} className="nav-item">
                {estados.btnVenta
                  ? <ButtonPill icon="fa-solid fa-credit-card">Realizar Venta </ButtonPill>
                  : <ButtonOutline icon="fa-solid fa-credit-card">Realizar Venta</ButtonOutline>}
              </li>
              <li className="nav-item">
                {user.permisos.includes('clientes')
                  ? estados.btnClientes
                    ? <ButtonPlusActive setBtn={setBtn} setBtnClientes={funciones.setBtnClientes} openModal={openModal} icon="fa-solid fa-address-book">Clientes</ButtonPlusActive>
                    : <ButtonPlus setBtn={setBtn} setBtnClientes={funciones.setBtnClientes} openModal={openModal} icon="fa-solid fa-address-book">Clientes</ButtonPlus>
                  : <ButtonPlus setBtn={setBtn} setBtnClientes={funciones.setBtnClientes} openModal={openModal} icon="fa-solid fa-address-book" disabled>Clientes</ButtonPlus>}
              </li>
              <li onClick={() => { if (user.permisos.includes('catalogo')) setBtn(funciones.setBtnCatalogo) }} className="nav-item">
                {user.permisos.includes('catalogo')
                  ? estados.btnCatalogo
                    ? <ButtonPill icon="fa-solid fa-book-open">Catálogo </ButtonPill>
                    : <ButtonOutline icon="fa-solid fa-book-open">Catálogo</ButtonOutline>
                  : <ButtonOutline disabled={true} icon="fa-solid fa-book-open">Catálogo</ButtonOutline>}
              </li>
              <li onClick={() => { if (user.permisos.includes('horarios')) setBtn(funciones.setBtnHorarios) }} className="nav-item">
                {user.permisos.includes('horarios')
                  ? estados.btnHorarios
                    ? <ButtonPill icon="fa-solid fa-clock">Horarios </ButtonPill>
                    : <ButtonOutline icon="fa-solid fa-clock">Horarios</ButtonOutline>
                  : <ButtonOutline disabled={true} icon="fa-solid fa-clock">Horarios</ButtonOutline>}
              </li>
              <li onClick={() => { if (user.permisos.includes('barbers')) setBtn(funciones.setBtnBarbers) }} className="nav-item">
                {user.permisos.includes('barbers')
                  ? estados.btnBarbers
                    ? <ButtonPill icon="fa-solid fa-scissors">Barbers </ButtonPill>
                    : <ButtonOutline icon="fa-solid fa-scissors">Barbers</ButtonOutline>
                  : <ButtonOutline disabled={true} icon="fa-solid fa-scissors">Barbers</ButtonOutline>}
              </li>
              <li onClick={() => { setBtn(funciones.setBtnAgenda) }} target='_blank' className="nav-item">
                {estados.btnAgenda
                  ? <ButtonPill icon="fa-solid fa-calendar">Agenda </ButtonPill>
                  : <ButtonOutline icon="fa-solid fa-calendar">Agenda</ButtonOutline>}
              </li>

              <li onClick={() => { if (user.permisos.includes('caja')) setBtn(funciones.setBtnCaja) }} className="nav-item">
                {user.permisos.includes('caja')
                  ? estados.btnCaja
                    ? <ButtonPill icon="fa-solid fa-cash-register">Caja </ButtonPill>
                    : <ButtonOutline icon="fa-solid fa-cash-register">Caja</ButtonOutline>
                  : <ButtonOutline disabled={true} icon="fa-solid fa-cash-register">Caja</ButtonOutline>}
              </li>
            </ul>
          </div>
          <div className="col-sm-10 col-md-2 d-flex justify-content-end pe-5">
            <ul className="navbar-nav mb-2 mb-lg-0 " >
              <li className="nav-item dropdown" id="profile">
                <div className="nav-link dropdown-toggle cont-img" style={{border: '3px solid ' + empleado.color}} href="#" id="navbarDropdown" role="button" data-bs-auto-close="outside" data-bs-toggle="dropdown" aria-expanded="false">
                  <img className="crop" src={foto} alt='user'/>
                </div>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark" style={{ width: '300px' }} aria-labelledby="navbarDropdown">
                  <li><button onClick={() => { setBtn(funciones.setBtnPerfil); dropdown.click() }} className="dropdown-item" >{empleado.nombre}</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li className="text-center">{descanso
                    ? !descansoFin && <button onClick={() => finalizarDescanso(user.id, getDescanso)} type="button" className="btn btn-success">Finalizar descanso: {tiempo}</button>
                    : <button onClick={() => iniciarDescanso(user.id, getDescanso)} id="btnDescanso" className="btn btn-info " type="button">
                      Iniciar descanso
                    </button>}
                  </li>
                  <li><button onClick={() => { setConceptoIngreso(''); setCantidadIngreso(''); document.getElementById('inputIngreso').focus() }} id="btnIngreso" className="dropdown-item" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIngreso" aria-expanded="false" aria-controls="collapseExample">
                    Registrar ingreso de efectivo
                  </button></li>
                  <li><div className="collapse text-center mx-3" id="collapseIngreso">
                    <label htmlFor="conceptoIngreso">Concepto</label>
                    <input onChange={(e) => setConceptoIngreso(e.target.value)} type="text" id="inputIngreso" className="form-control" value={conceptoIngreso} />
                    <label htmlFor="ingreso">Cantidad</label>
                    <input onChange={(e) => setCantidadIngreso(e.target.value)} type="number" className="form-control w-50 mx-auto" value={cantidadIngreso} />
                    <button onClick={() => setIngreso()} className="btn btn-outline-success my-2">Registrar ingreso</button>
                  </div></li>
                  <li><button onClick={() => { setConceptoRetiro(''); setCantidadRetiro(''); document.getElementById('inputRetiro').focus() }} id="btnRetiro" className="dropdown-item" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRetiro" aria-expanded="false" aria-controls="collapseExample">
                    Registrar retiro de efectivo
                  </button></li>
                  <li><div className="collapse text-center mx-3" id="collapseRetiro">
                    <label htmlFor="conceptoRetiro">Concepto</label>
                    <input onChange={(e) => setConceptoRetiro(e.target.value)} type="text" id="inputRetiro" className="form-control" value={conceptoRetiro} />
                    <label htmlFor="retiro">Cantidad</label>
                    <input onChange={(e) => setCantidadRetiro(e.target.value)} type="number" className="form-control w-50 mx-auto" value={cantidadRetiro} />
                    <button onClick={() => setRetiro()} className="btn btn-outline-danger my-2">Registrar retiro</button>
                  </div></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={() => { registrarSalida(user.id, logout) }} className="dropdown-item" >Registrar salida</button></li>
                  <li><button onClick={() => { logout() }} className="dropdown-item" >Cerrar sesión</button></li>
                </ul>
              </li>
            </ul>
          </div>
          {/* <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form> */}
        </div>
      </div>

      <div id='crearCliente' className="modal fade" aria-hidden='true'>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="text-success" id='title'>Registrar nuevo cliente</h4>
              <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-user"></i></span>
                <input type="text" className="form-control" id='name' placeholder='Nombre' value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-phone"></i></span>
                <input type="text" className="form-control" id='tel' placeholder='Telefono' value={telefonoCliente}
                  onChange={(e) => setTelefonoCliente(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-cake-candles"></i></span>
                <input type="date" className="form-control" id='fecha' placeholder='Cumpleaños' value={fechaNacimientoCliente}
                  onChange={(e) => setFechaNacimientoCliente(e.target.value)}
                />
              </div>
              <div className="input-group mb-3 border rounded">
                <span className="input-group-text me-4"><i className="fa-solid fa-venus-mars"></i><span className='ms-2'>Género</span></span>
                <div className="checkbox-tick my-auto"
                  onChange={(e) => {
                    setGenero(e.target.value)
                  }}
                >
                  <label className="male me-3">
                    <input id='checkHombre' type="radio" name="gender" value="H" /> Hombre
                    <span className="checkmark"></span>
                  </label>
                  <label className="female">
                    <input id='checkMujer' type="radio" name="gender" value="M" /> Mujer
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
              <div>
                <button id='btnCerrar' type='button' className="btn btn-secondary me-3" data-bs-dismiss='modal'>
                  <i className="fa-solid fa-xmark me-2" />Cancelar
                </button>
                <button onClick={() => validar()} id='btnA' className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk me-2" />Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}