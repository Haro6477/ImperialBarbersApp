import React, { useEffect, useState } from 'react'
import { addReporte } from '../funciones'
import { ImprimirReporte } from '../Impresiones'

const Caja = ({ user }) => {
  // const server = 'http://localhost'
  const server = import.meta.env.VITE_SERVER

  const [total, setTotal] = useState("")  
  const [efectivo, setEfectivo] = useState(0)
  const [dineroElectronico, setDineroElectronico] = useState(0)
  const [pts, setPts] = useState(0)
  const [cobrosHoy, setCobrosHoy] = useState([])
  const [loadingCaja, setLoadingCaja] = useState(true)
  const [loadingCobros, setLoadingCobros] = useState(true)
  const [loadingMovimientos, setLoadingMovimientos] = useState(true)
  const [idCobro, setIdCobro] = useState("")
  const [cliente, setCliente] = useState("")
  const [totalPuntos, setTotalPuntos] = useState("")
  const [metodoPago, setMetodoPago] = useState("")
  const [barber, setBarber] = useState("")
  const [cobrador, setCobrador] = useState("")
  const [fecha, setFecha] = useState("")
  const [pagoEfectivo, setPagoEfectivo] = useState("")
  const [pagoTarjeta, setPagoTarjeta] = useState("")
  const [pagoPuntos, setPagoPuntos] = useState("")
  const [ingresos, setIngresos] = useState([])
  const [retiros, setRetiros] = useState([])

  useEffect(() => {
    getCaja();
    getCrobrosHoy()
    getMovimientos()
  }, [])

  const getCaja = () => {
    axios.get(`${server}/caja`).then((response) => {
      setEfectivo(response.data[0].efectivo);
      setDineroElectronico(response.data[0].dineroElectronico);
      setPts(response.data[0].puntos)
      setTotal(response.data[0].efectivo + response.data[0].dineroElectronico)
    }).finally(() => setLoadingCaja(false))
  }

  const getCrobrosHoy = () => {
    axios.get(`${server}/cobros-hoy`).then((response) => {
      setCobrosHoy(response.data);
    }).finally(() => setLoadingCobros(false))
  }
  
  const getMovimientos = () => {
    axios.get(`${server}/movimientos`).then((response) => {
      const movimientos = (response.data);
      movimientos.forEach(movimiento => {
        if(movimiento.cantidad >= 0){
          setIngresos(ingresos.concat(movimiento))
        }else{
          setRetiros(retiros.concat(movimiento))
        }
      });
    }).finally(() => setLoadingMovimientos(false))
  }

  const openModal = (id, cliente, total, totalPuntos, metodoPago, barber, cobrador, fecha, pagoEfectivo, pagoTarjeta, pagoPuntos) => {
    setIdCobro(id)
    setCliente(cliente)
    setTotal(total)
    setTotalPuntos(totalPuntos)
    setMetodoPago(metodoPago)
    setBarber(barber)
    setCobrador(cobrador)
    setFecha(fecha)
    setPagoEfectivo(pagoEfectivo)
    setPagoTarjeta(pagoTarjeta)
    setPagoPuntos(pagoPuntos)
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

  return (
    <div className='container'>
      {loadingCaja &&
        <i className="fa-solid fa-compact-disc fa-spin fa-2xl my-5" />
      }
      <div className="shadow-sm rounded border col-12 col-xl-6 pb-2 pt-3 px-3 mb-5k mx-auto">
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

      <div className="rounded shadow-sm bg-dark px-1 py-1 my-4">
        {loadingCobros &&
          <i className="fa-solid fa-compact-disc fa-spin fa-2xl my-5" />
        }
        <table className='table table-dark table-sm'>
          <thead>
            <tr>
              <th className='text-start'>Cliente</th>
              <th className='text-start'>Barber</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cobrosHoy.map((cobro) => (
              <tr key={cobro.id} className='hover' data-bs-toggle='modal' data-bs-target='#modal-cobros'
                onClick={() => openModal(cobro.id, cobro.cliente, cobro.total, cobro.totalPuntos, cobro.metodoPago, cobro.barber, cobro.cobrador, cobro.fecha, cobro.pagoEfectivo, cobro.pagoTarjeta, cobro.pagoPuntos)}>
                <td className='text-start'>{cobro.cliente}</td>
                <td className='text-start'>{cobro.barber}</td>
                <td>${cobro.total}.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loadingMovimientos &&
        <i className="fa-solid fa-compact-disc fa-spin fa-2xl my-5" />
      }
      
      <div className="my-4 text-end fixed-bottom me-5">
        <button onClick={() => addReporte(total, user.nombre, retiros, ingresos, user.id, efectivo, dineroElectronico, pts)} className='btn btn-danger'><strong>Realizar reporte</strong></button>
      </div>

      <div id='modal-cobros' className="modal fade" aria-hidden='true'>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{cliente}</h4>
              <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className="modal-body">
              <h5 className='text-info'>Cuenta: </h5><span className='h6'>No.{idCobro + ' / ' + formatearFecha(fecha)}</span>
              <h5 className='mt-3 text-info'>Total: </h5><span className='h6'>${total}.00</span>
              <h5 className='mt-3 text-info'>Puntos ganados: </h5><span className='h6'>{totalPuntos} pts.</span>
              <h5 className='mt-3 text-info'>Método de pago: </h5><span className='h6'>{metodoPago == 'e' ? 'Efectivo' : metodoPago == 't' ? 'Tarjeta' : metodoPago == 'p' ? 'Puntos' : 'Mixto'}</span>
              <h5 className='text-dark'>{metodoPago == 'e' ? '$' + pagoEfectivo + '.00' : metodoPago == 't' ? '$' + pagoTarjeta + '.00' : metodoPago == 'p' ? pagoPuntos + 'pts.' : 'Efectivo: $' + pagoEfectivo + '.00' + ' Tarjeta: $' + pagoEfectivo + '.00' + ' Puntos: $' + pagoEfectivo + '.00'}</h5>
              <h5 className='mt-3 text-info'>Barbero que lo atendió: </h5><span className='h6'>{barber}</span>
              <h5 className='mt-3 text-info'>Quién cobró: </h5><span className='h6'>{cobrador}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Caja