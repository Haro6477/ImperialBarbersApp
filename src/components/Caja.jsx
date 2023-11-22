import React, { useEffect, useState } from 'react'
import { addReporte, capitalize, getDetallesPro, getDetallesServ, getEmpleado } from '../funciones'
import { ImprimirReporte } from '../Impresiones'
import Axios from 'axios'

const Caja = ({ user }) => {
  // const server = 'http://localhost'
  const server = import.meta.env.VITE_SERVER

  const [efectivo, setEfectivo] = useState(0)
  const [dineroElectronico, setDineroElectronico] = useState(0)
  const [pts, setPts] = useState(0)
  const [cobrosHoy, setCobrosHoy] = useState([])
  const [loadingCaja, setLoadingCaja] = useState(true)
  const [loadingCobros, setLoadingCobros] = useState(true)
  const [loadingHistorial, setLoadingHistorial] = useState(false)
  const [loadingMovimientos, setLoadingMovimientos] = useState(true)
  const [idCobro, setIdCobro] = useState("")
  const [cliente, setCliente] = useState("")
  const [totalCobro, setTotalCobro] = useState("")
  const [subtotal, setSubtotal] = useState("")
  const [descuento, setDescuento] = useState("0")
  const [totalPuntos, setTotalPuntos] = useState("")
  const [metodoPago, setMetodoPago] = useState("")
  const [barber, setBarber] = useState("")
  const [cobrador, setCobrador] = useState("")
  const [fecha, setFecha] = useState("")
  const [pagoEfectivo, setPagoEfectivo] = useState("")
  const [pagoTarjeta, setPagoTarjeta] = useState("")
  const [pagoPuntos, setPagoPuntos] = useState("")
  const [historial, setHistorial] = useState(false)
  const [detallesServicio, setDetallesServ] = useState([])
  const [detallesProducto, setDetallesPro] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [empleado, setEmpleado] = useState({})

  let imageRandom = `/src/images/random${(Math.trunc(Math.random() * 5) + 1)}.png`
  const tableDiv = document.getElementById('tableDiv')
  let cobros = []
  const tbody = document.getElementById('tbody')
  const opciones = { weekday: 'long', month: 'long', day: 'numeric' }

  useEffect(() => {
    getCaja();
    getCrobrosHoy()
    getMovimientosHoy()
    getEmpleado(user.id, setEmpleado)
  }, [])

  const getCaja = () => {
    axios.get(`${server}/caja`).then((response) => {
      setEfectivo(response.data[0].efectivo);
      setDineroElectronico(response.data[0].dineroElectronico);
      setPts(response.data[0].puntos)
    }).finally(() => setLoadingCaja(false))
  }

  const getCrobrosHoy = () => {
    axios.get(`${server}/cobros-hoy`).then((response) => {
      setCobrosHoy(response.data);
    }).finally(() => setLoadingCobros(false))
  }

  const getMovimientosHoy = () => {
    setLoadingMovimientos(true)
    axios.get(`${server}/movimientos-hoy`).then((response) => {
      setMovimientos(response.data)
    }).finally(() => setLoadingMovimientos(false))
  }

  const openModal = (id, cliente, total, subtotal, descuento, totalPuntos, metodoPago, barber, cobrador, fecha, pagoEfectivo, pagoTarjeta, pagoPuntos) => {
    setIdCobro(id)
    setCliente(cliente)
    setSubtotal(subtotal)
    setTotalCobro(total)
    setDescuento(descuento)
    setTotalPuntos(totalPuntos)
    setMetodoPago(metodoPago)
    setBarber(barber)
    setCobrador(cobrador)
    setFecha(fecha)
    setPagoEfectivo(pagoEfectivo)
    setPagoTarjeta(pagoTarjeta)
    setPagoPuntos(pagoPuntos)
    getDetallesServ(id, setDetallesServ)
    getDetallesPro(id, setDetallesPro)
  }

  function formatearFecha(fecha) {
    const date = new Date(fecha);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getUTCDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let hh = date.getHours() + 1
    let min = date.getMinutes()
    let ss = date.getSeconds()
    if (hh < 10) hh = '0' + h;
    if (min < 10) min = '0' + min;
    if (ss < 10) ss = '0' + ss;
    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
  }

  const getCobrosHistorial = () => {
    setHistorial(true)
    setLoadingHistorial(true)
    tableDiv.className = 'rounded py-1 px-1 shadow-sm bg-light border mb-5 d-block'
    Axios.get(`${server}/cobros`).then((response) => {
      cobros = response.data
    }).then(() => {
      let fechaIndex = new Date(2022, 1, 1)
      cobros.forEach(cobro => {
        if (new Date(cobro.fecha).toDateString() != new Date().toDateString()) {
          if (new Date(cobro.fecha).toLocaleDateString('es-mx') != new Date(fechaIndex).toLocaleDateString('es-mx')) {
            fechaIndex = cobro.fecha
            const trFecha = document.createElement('tr')
            const tdFecha = document.createElement('td')
            tdFecha.colSpan = 4
            tdFecha.innerHTML = '<strong>' + capitalize(new Date(cobro.fecha).toLocaleDateString('es-mx', opciones)) + '</strong>'
            trFecha.appendChild(tdFecha)
            trFecha.className = 'table-primary'
            tbody.appendChild(trFecha)
          }
          if (cobro.cliente != "Cliente De Pruebas") {
            const tr = document.createElement('tr')
            const tdCliente = document.createElement('td')
            const tdBarber = document.createElement('td')
            const tdMetodo = document.createElement('td')
            const span = document.createElement('span')
            const tdTotal = document.createElement('td')
            tdCliente.innerText = cobro.cliente
            tdCliente.className = 'text-start'
            tdBarber.innerText = cobro.barber
            tdBarber.className = 'text-start'
            tdTotal.innerText = '$ ' + cobro.total
            switch (cobro.metodoPago) {
              case 'e':
                span.innerText = 'Efectivo'
                span.className = 'badge bg-success'
                break;
              case 't':
                span.innerText = 'Tarjeta'
                span.className = 'badge bg-info'
                break;
              case 'p':
                span.innerText = 'Puntos'
                span.className = 'badge bg-danger'
                break;
              default:
                span.innerText = 'Mixto'
                span.className = 'badge bg-warning'
                break;
            }
            tdMetodo.appendChild(span)
            tr.appendChild(tdCliente)
            tr.appendChild(tdBarber)
            tr.appendChild(tdMetodo)
            tr.appendChild(tdTotal)
            tr.className = 'pointer'
            tr.setAttribute('data-bs-toggle', 'modal')
            tr.setAttribute('data-bs-target', '#modal-cobros')
            tr.addEventListener('click', () => openModal(cobro.id, cobro.cliente, cobro.total, cobro.subtotal, cobro.descuento, cobro.totalPuntos, cobro.metodoPago, cobro.barber, cobro.cobrador, cobro.fecha, cobro.pagoEfectivo, cobro.pagoTarjeta, cobro.pagoPuntos))
            tbody.appendChild(tr)
          }
        }
      })
    }).finally(() => setLoadingHistorial(false))
  }

  const ocultarHistorial = () => {
    setHistorial(false)
    tableDiv.className = 'rounded py-1 px-1 shadow-sm bg-light border mb-5 d-none'
    tbody.innerHTML = ''
  }

  return (
    <div className='container'>
      {loadingCaja &&
        <img className='my-4' src="src/images/caramel.gif" height={64} alt="" />
      }
      <div className="row">
        <div className="col text-start"></div>
        <div className="col col-12 col-xl-6 shadow-sm rounded border pb-2 pt-3 px-3 mb-4 mx-auto">
          <div className="row">
            <h1 className='mb-3'>Caja: <span className='badge bg-dark'>${efectivo + dineroElectronico}.00</span> </h1>
            <div className="col">
              <strong>Efectivo</strong>
              <br /><h4>
                <span className='badge bg-success'>${efectivo}.00</span>
              </h4>
            </div>
            <div className="col">
              <strong>Dinero electrónico</strong>
              <br /><h4>
                <span className='badge bg-primary'>${dineroElectronico}.00</span>
              </h4>
            </div>
            <div className="col">
              <strong>Puntos canjeados</strong>
              <br /><h4>
                <span className='badge bg-secondary'>{pts} pts.</span>
              </h4>
            </div>
          </div>
        </div>
        <div className="col"><h3>{capitalize(new Date().toLocaleDateString('es-mx', opciones))}</h3></div>
      </div>


      <div className="row">
        <div className="col-7">
          <div className="rounded shadow-sm bg-dark px-1 py-1 ">
            {loadingCobros &&
              <img className='my-4' src="src/images/caramel.gif" height={64} alt="" />
            }
            <h3 className='text-white my-2'>Servicios de hoy</h3>
            <table className='table table-dark table-sm'>
              <thead>
                <tr>
                  <th className='text-start'>Cliente</th>
                  <th className='text-start'>Barber</th>
                  <th>Método pago</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cobrosHoy.map((cobro) => (
                  <tr key={cobro.id} className='hover' data-bs-toggle='modal' data-bs-target='#modal-cobros'
                    onClick={() => openModal(cobro.id, cobro.cliente, cobro.total, cobro.subtotal, cobro.descuento, cobro.totalPuntos, cobro.metodoPago, cobro.barber, cobro.cobrador, cobro.fecha, cobro.pagoEfectivo, cobro.pagoTarjeta, cobro.pagoPuntos)}>
                    {cobro.cliente == "Cliente De Pruebas" ? <td className='text-start text-secondary'>{cobro.cliente}</td> : <td className='text-start'>{cobro.cliente}</td>}
                    {cobro.cliente == "Cliente De Pruebas" ? <td className='text-start text-secondary'>{cobro.barber}</td> : <td className='text-start'>{cobro.barber}</td>}
                    {cobro.metodoPago == 'e' ? <td> <span className='badge bg-success'>Efectivo</span></td>
                      : cobro.metodoPago == 't' ? <td><span className='badge bg-info'>Tarjeta</span></td>
                        : cobro.metodoPago == 'p' ? <td><span className='badge bg-danger'>Puntos</span></td>
                          : <td><span className='badge bg-warning'>Mixto</span></td>}
                    {cobro.cliente == "Cliente De Pruebas" ? <td className='text-secondary'>${cobro.total}.00</td> : <td>${cobro.total}.00</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-5">
          {movimientos.length > 0 ? <div className="rounded shadow-sm bg-light px-1 py-1 border">
            {loadingMovimientos &&
              <img className='my-4' src="src/images/caramel.gif" height={64} alt="" />
            }
            <h3>Movimientos de hoy</h3>
            <table className='table table-light table-sm'>
              <thead>
                <tr>
                  <th className='text-start'>Barber</th>
                  <th className='text-start'>Concepto</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((movimiento) => (
                  <tr key={movimiento.id}>
                    <td className='text-start'>{movimiento.nombre}</td>
                    <td className='text-start'>{movimiento.concepto}</td>
                    {movimiento.cantidad < 0 ? <td className='text-danger h6'>${movimiento.cantidad}.00</td>
                      : <td className='text-success h6'>${movimiento.cantidad}.00</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            : <img src={imageRandom} className='w-75'></img>}
        </div>
      </div>


      {loadingHistorial &&
        <img className='my-4' src="src/images/caramel.gif" height={64} alt="" />
      }

      <div className="my-4 position-fixed bottom-0 end-0  me-5">
        <button onClick={() => addReporte(efectivo + dineroElectronico, empleado.nombre, movimientos, user.id, efectivo, dineroElectronico, pts)} className='btn btn-danger'><strong>Realizar reporte</strong></button>
      </div>

      {!historial
        ? <div className='my-3 mb-5'>
          <button className='btn btn-outline-dark rounded-pill' style={{ width: '40px', height: '40px' }}
            onClick={() => { getCobrosHistorial() }}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        : <div className='my-3'><button onClick={() => ocultarHistorial()} className='btn btn-secondary'>Cerrar historial</button></div>}

      <div id='tableDiv' className="rounded py-1 px-1 shadow-sm bg-light border mb-5 d-none">
        <table className='table table-light table-sm table-hover'>
          <thead>
            <tr>
              <th className='text-start'>Cliente</th>
              <th className='text-start'>Barber</th>
              <th>Método pago</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody id='tbody'>
          </tbody>
        </table>
      </div>
      <div id='modal-cobros' className="modal fade" aria-hidden='true'>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{cliente}</h4>
              <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className="modal-body text-start">
              <div className="row">
                <div className="col-4">
                  <span className='h6'><span className='text-warning'>No.{idCobro }</span>{' / ' + formatearFecha(fecha)}</span>
                  <h5 className='mt-2 text-info'>Subtotal: <span className='text-dark'>${subtotal}</span></h5>
                  <h5 className='mt-2 text-info'>Descuento: <span className='text-dark'>${descuento ? descuento : 0}</span></h5>
                  <h3 className='mt-2 text-info'>Total: <span className='text-success'>${totalCobro}</span></h3>
                  <h5 className='mt-2 text-info'>Puntos ganados: <span className='text-dark'>{totalPuntos} pts.</span></h5>
                  <hr />
                  <h5 className='mt-2 text-info'>Método de pago </h5><span className='h6'>{metodoPago == 'e' ? 'Efectivo' : metodoPago == 't' ? 'Tarjeta' : metodoPago == 'p' ? 'Puntos' : 'Mixto'}</span>
                  <h6 className='text-dark'>
                    {metodoPago == 'e'
                      ? <span className='text-success'>${pagoEfectivo}</span>
                      : metodoPago == 't'
                        ? <span className='text-primary'>${pagoTarjeta}</span>
                        : metodoPago == 'p' ? <span className='text-danger'>{pagoPuntos} pts.</span>
                          : <div><span className='text-success'>Efectivo: ${pagoEfectivo}</span><span className='text-primary'> Tarjeta: ${pagoTarjeta} </span> <span className='text-danger'> Puntos: ${pagoPuntos}</span></div>}
                  </h6>
                  <h5 className='mt-2 text-info'>Barbero que lo atendió </h5><span className='h6'>{barber}</span>
                  <h5 className='mt-2 text-info'>Quién cobró </h5><span className='h6'>{cobrador}</span>
                </div>
                <div className="col-8">
                  <h4 className='text-center'>Detalles de la venta</h4>
                  <div className='my-4 mx-5 px-1 py-1 border rounded'>
                    <div className="table-responsive">
                      <table className='table table-borderless text-center'>
                        <thead>
                          <tr>
                            <th className='text-start'>Concepto</th>
                            <th>Cantidad</th>
                            <th>Cobro</th>
                            <th>Pts. Ganados</th>
                            <th>Barber</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detallesServicio.map((detalle) => (
                            <tr key={detalle.id}>
                              <td className='text-start'>{detalle.nombre}</td>
                              <td>{detalle.cantidad}</td>
                              <td>$ {detalle.precioActual * detalle.cantidad}.00</td>
                              <td>{detalle.puntosActual * detalle.cantidad} pts.</td>
                              {<td>{detalle.barber}</td>}
                            </tr>
                          ))}
                          {detallesProducto.map((detalle) => (
                            <tr key={detalle.id}>
                              <td className='text-start'>{detalle.nombre}</td>
                              <td>{detalle.cantidad}</td>
                              <td>$ {detalle.precioActual * detalle.cantidad}.00</td>
                              <td>{detalle.puntosActual * detalle.cantidad} pts.</td>
                              <td>{detalle.barber ? detalle.barber : barber}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Caja