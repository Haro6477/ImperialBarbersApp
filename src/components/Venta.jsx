import React, { useCallback, useEffect, useState } from 'react'
import '../estilos/forms.css'
import { addCobro, showAlert } from '../funciones'
import { ImprimirTicket } from '../Impresiones'
import { BarraBusqueda } from './BarraBusqueda'
import { FilaTablaVenta } from './filaTablaVenta'

const Venta = ({ user }) => {
  // const server = 'http://localhost'
  const server = import.meta.env.VITE_SERVER
  const municipio = import.meta.env.VITE_MUNICIPIO

  const [productos, setProductos] = useState([])
  const [servicios, setServicios] = useState([])
  const [clientes, setClientes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [empleado, setEmpleado] = useState({})
  const [loading, setLoading] = useState(true)
  const [cumple, setCumple] = useState(false)

  const [txtCliente, setTxtCliente] = useState("")
  const [txtProServ, setTxtProServ] = useState("")

  const [cliente, setCliente] = useState({})
  const [itemLista, setItem] = useState({})
  const [listaProductos, setListaProductos] = useState([])
  const [listaServicios, setListaServicios] = useState([])
  const [cantidad, setCantidad] = useState(1)
  const [subtotal, setSubtotal] = useState(0)
  const [ptsAcumulados, setPtsAcumulados] = useState(0)
  const [metodoPago, setMetodoPago] = useState('e')
  const [idBarber, setIdBarber] = useState(user.id)
  const [divider, setDivider] = useState(false)
  const [descuento, setDescuento] = useState(0)
  const [conDescuento, setConDescuento] = useState(false)

  // Montos de pago
  const [efectivo, setEfectivo] = useState(0)
  const [pts, setPts] = useState(0)
  const [tarjeta, setTarjeta] = useState(0)

  const inputCliente = document.getElementById('input1')
  const dropClientes = document.getElementById("drop1")
  const inputProServ = document.getElementById('input2')
  const dropProServ = document.getElementById("drop2")
  const spanPts = document.getElementById('spanPts')
  const btnDividir = document.getElementById('btnDividir')

  const classInputNone = 'd-none'
  const classInputBlock = 'w-100 d-block form-select text-secondary'

  useEffect(() => {
    getClientes();
    getProductos();
    getServicios();
    getEmpleados()
  }, [])

  const getEmpleados = () => {
    axios.get(`${server}/empleados/${municipio}`).then((response) => {
      const empleadosMunicipio = (response.data)
      const empleadosActivos = empleadosMunicipio.filter(empleado => empleado.estatus == "A");
      setEmpleados(empleadosActivos);
      setEmpleado(empleadosActivos[0])
    })
  }

  const getClientes = () => {
    setLoading(true)
    axios.get(`${server}/clientes`).then((response) => {
      setClientes(response.data);
    }).finally(setLoading(false))
  }

  const getProductos = () => {
    setLoading(true)
    axios.get(`${server}/productos/${municipio}`).then((response) => {
      setProductos(response.data);
    }).finally(setLoading(false))
  }

  const getServicios = () => {
    setLoading(true)
    axios.get(`${server}/servicios/${municipio}`).then((response) => {
      setServicios(response.data);
    }).finally(setLoading(false))
  }

  const dropdownProServ = (valor) => {
    setTxtProServ(valor)
    inputProServ.value == ""
      ? dropProServ.className = classInputNone
      : dropProServ.className = classInputBlock
  }

  const obtenerEmpleado = (id) => {
    setEmpleado(empleados.find((e) => e.id == id))
  }

  useEffect(() => {
    let suma = 0
    let puntos = 0

    listaProductos.forEach((producto) => {
      suma += producto.precio * producto.cantidad
      puntos += producto.pts * producto.cantidad
    })
    listaServicios.forEach((servicio) => {
      suma += servicio.precio * servicio.cantidad
      puntos += servicio.pts * servicio.cantidad
    })
    setSubtotal(suma)
    setPtsAcumulados(puntos)
  }, [listaProductos, listaServicios]);

  const handleSubmit = () => {
    if (inputProServ.value == "" || Object.keys(itemLista).length === 0) { return }
    dropClientes.className = classInputNone
    dropProServ.className = classInputNone
    
    const itemConCantidad = {
      ...itemLista,
      cantidad: cantidad
    };
    inputProServ.value = ""
    itemLista.tipo === 'p' ? setListaProductos(listaProductos.concat(itemConCantidad)) : setListaServicios(listaServicios.concat(itemConCantidad))
    // setSubtotal(subtotal + itemLista.precio * cantidad)
    // setPtsAcumulados(ptsAcumulados + itemLista.pts * cantidad)
    setItem({})
    setCantidad(1)
    if (listaProductos.length + listaServicios.length >= 1) {
      btnDividir.className = 'btn btn-danger'
    }
  }


  const nuevoCobro = (() => {
    switch (metodoPago) {
      case 'e':
        addCobro(cliente.nombre, empleado.nombre, cliente.pts, +descuento / 100 * +subtotal, subtotal, divider, getClientes, cliente.id, subtotal - descuento / 100 * subtotal, ptsAcumulados - descuento / 100 * ptsAcumulados, metodoPago, empleado.id, user.id, subtotal - +descuento / 100 * +subtotal, 0, 0, listaProductos, listaServicios)
        break;
      case 't':
        addCobro(cliente.nombre, empleado.nombre, cliente.pts, +descuento / 100 * +subtotal, subtotal, divider, getClientes, cliente.id, subtotal - descuento / 100 * subtotal, ptsAcumulados - descuento / 100 * ptsAcumulados, metodoPago, empleado.id, user.id, 0, subtotal - +descuento / 100 * +subtotal, 0, listaProductos, listaServicios)
        break;
      case 'p':
        if (cliente.pts / 2 >= subtotal) {
          addCobro(cliente.nombre, empleado.nombre, cliente.pts, +descuento / 100 * +subtotal, subtotal, divider, getClientes, cliente.id, subtotal - descuento / 100 * subtotal, - pts, metodoPago, empleado.id, user.id, 0, 0, subtotal * 2 - +descuento / 100 * +subtotal, listaProductos, listaServicios)
        } else {
          showAlert("Puntos insuficientes", 'error')
          return
        }
        break;
      default:
        if (cliente.pts >= pts) {
          addCobro(cliente.nombre, empleado.nombre, cliente.pts, +descuento / 100 * +subtotal, subtotal, divider, getClientes, cliente.id, subtotal - descuento / 100 * subtotal, ptsAcumulados - pts * 1.05 - descuento / 100 * ptsAcumulados, metodoPago, empleado.id, user.id, efectivo, tarjeta, pts, listaProductos, listaServicios)
        } else {
          showAlert("Puntos insuficientes", 'error')
          return
        }
        break;
    }
    reset()
  })

  const reset = () => {
    inputCliente.value = ''
    inputProServ.value = ''
    setListaProductos([])
    setListaServicios([])
    setSubtotal(0)
    setPtsAcumulados(0)
    inputCliente.focus()
    spanPts.innerText = ''
    document.getElementById('flexRadioDefault1').checked = true
    setMetodoPago('e')
    setEfectivo(0)
    setTarjeta(0)
    setPts(0)
    setDescuento(0)
    // btnDividir.className = 'btn btn-danger'
    // btnDividir.innerText = 'Dividir'
    setDivider(false)
    
    conDescuento && document.getElementById('btnDescuento').click()
  }

  const mostrarSelects = () => {
    if (listaProductos.length + listaServicios.length < 2) return
    if (divider) {
      btnDividir.className = 'btn btn-danger'
      btnDividir.innerText = 'Dividir'
    }
    else {
      btnDividir.className = 'btn btn-secondary'
      btnDividir.innerText = 'Cancelar'
    }
    setDivider(!divider)
  }

  return (
    <div className='container'>
      <div className="row">
        <div className="col-sm-12 col-md-10">
          <div className='mb-3 mt-1'>
            <BarraBusqueda idBarber={empleado && empleado.id} datos={clientes} setDato={setCliente} txtInput={txtCliente} setTxtInput={setTxtCliente} placeholder={'Clientes'} focus={true} cumple={cumple} setCumple={setCumple} id={1}></BarraBusqueda>
          </div>
        </div>
        <div className="col-sm-8 col-md-2 mb-3 pt-1">
          {Object.keys(cliente).length > 0 && <span className={cumple ? 'h4 cumple text-info' : 'h4 text-info'} id='spanPts'>{cliente.pts} pts.</span>}
        </div>
      </div>

      <div className="row">
        <div className="col-4 col-md-2 my-2">
          <div className="input-group ">
            <span className="input-group-text"><i className="fa-solid fa-list-ol"></i></span>
            <input type="number" className="form-control" id='cantidad' placeholder='Cantidad' min='1' value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
        </div>

        <div className="col-8 my-2">
          <BarraBusqueda idBarber={empleado && empleado.id} datos={servicios} datos2={productos} setDato={setItem} txtInput={txtProServ} setTxtInput={setTxtProServ} placeholder={'Servicios y productos'} id={2}></BarraBusqueda>
        </div>

        <div className="col-8 col-md-2 d-flex mx-auto my-2">
          <button onClick={() => handleSubmit()} id='btnAdd' className='btn btn-dark w-100 mx-auto'>
            <i className="fa-solid fa-circle-plus"></i> Añadir
          </button>
        </div>
      </div>

      <div className="shadow-sm resumen rounded border my-3 table-responsive">
        <table className="table table-borderless align-middle">
          <thead className='table-dark align-middle'>
            <tr>
              <th className='text-start ps-5' style={{maxWidth:'10rem'}}>Cantidad</th>
              <th className='text-start'>Servicio o Producto</th>
              <th>Precio c/u</th>
              <th>Subtotal</th>
              <th className='text-end'><button onClick={() => mostrarSelects()} className={!divider ? 'btn btn-outline-danger' : 'btn btn-secondary'} id='btnDividir' >Dividir</button></th>
            </tr>
          </thead>
          <tbody>
            {listaServicios.map((servicio, i) => (
              <FilaTablaVenta key={i} divider={divider} item={servicio} listaItems={listaServicios} setLista={setListaServicios} empleados={empleados} index={i}></FilaTablaVenta>
            ))}
            {listaProductos.map((producto, i) => (
              <FilaTablaVenta key={i} divider={divider} item={producto} listaItems={listaProductos} setLista={setListaProductos} empleados={empleados} index={i}></FilaTablaVenta>
            ))}
          </tbody>
          <tfoot className='table-secondary h5'>
            <tr>
              <td></td><td></td><td></td>
              <td className='text-end'><strong>Total:</strong></td>
              <td className='h4'>${subtotal} {descuento > 0 && <span className='text-info'>-%{descuento} = <span className='text-primary h3'>${+descuento / 100 * -subtotal + +subtotal}</span> </span>}</td>
            </tr>
          </tfoot>
        </table>
        <div className="text-end">
          <button onClick={() => { setDescuento(0), setConDescuento(!conDescuento) }} id='btnDescuento' className={!conDescuento ? 'btn btn-sm text-white me-3 mb-3 btn-info' : 'btn btn-sm text-white me-3 mb-3 btn-secondary'} data-bs-toggle="collapse" data-bs-target="#collapseDescuento" aria-expanded="false"><strong>{!conDescuento ? 'Aplicar descuento' : 'Cancelar'}</strong></button>
          <div className="collapse mb-2 me-3" id='collapseDescuento'>
            <input onChange={() => setDescuento(10)} type="radio" className="btn-check" name="options-outlined" id="10%" autoComplete="off" />
            <label className="btn btn-outline-info btn-sm" htmlFor="10%">10%</label>

            <input onChange={() => setDescuento(20)} type="radio" className="btn-check" name="options-outlined" id="20%" autoComplete="off" />
            <label className="btn btn-outline-info btn-sm" htmlFor="20%">20%</label>

            <input onChange={() => setDescuento(30)} type="radio" className="btn-check" name="options-outlined" id="30%" autoComplete="off" />
            <label className="btn btn-outline-info btn-sm" htmlFor="30%">30%</label>

            <input onChange={() => setDescuento(50)} type="radio" className="btn-check" name="options-outlined" id="50%" autoComplete="off" />
            <label className="btn btn-outline-info btn-sm" htmlFor="50%">50%</label>
          </div>
        </div>

      </div>

      <div className='row mb-4 border rounded py-3 px-3 shadow-sm d-flex' style={{ background: '#dae0e8' }}>
        <div className="col">
          <h5 className='mb-3'>Método de pago</h5>
          <div className="row ">
            <div className="col align-self-center">
              <div className=" text-start">
                <div className="form-check ">
                  <input onChange={(e) => setMetodoPago('e')} className="form-check-input shadow-sm" type="radio" name="flexRadioDefault" id='flexRadioDefault1' value={'e'} defaultChecked />
                  <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Efectivo
                  </label>
                </div>
              </div>
            </div>
            <div className="col align-self-center">
              <div className=" text-start ">
                <div className="form-check">
                  <input onChange={(e) => setMetodoPago('t')} className="form-check-input shadow-sm" type="radio" name="flexRadioDefault" id='flexRadioDefault2' value={'t'} />
                  <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Tarjeta
                  </label>
                </div>
              </div>
            </div>

            <div className="col align-self-center">
              <div className=" text-start ">
                <div className="form-check">
                  <input onChange={(e) => setMetodoPago('p')} className="form-check-input shadow-sm" type="radio" name="flexRadioDefault" id='flexRadioDefault3' value={'p'} />
                  <label className="form-check-label" htmlFor="flexRadioDefault3">
                    Puntos
                  </label>
                </div>
              </div>
            </div>

            <div className={metodoPago != 'm' ? 'col align-self-center' : 'col align-self-center d-none'}>
              <div className=" text-start ">
                <div className="form-check">
                  <input onChange={(e) => setMetodoPago('m')} className="form-check-input shadow-sm" type="radio" name="flexRadioDefault" id='flexRadioDefault4' value={'m'} />
                  <label className="form-check-label" htmlFor="flexRadioDefault4">
                    Mixto
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {metodoPago === 'm' &&
          <div className="col">
            <div className="input-group mb-1">
              <span className="input-group-text"><i className="fa-solid fa-money-bills me-1"></i>Efectivo</span>
              <input type="number" min={0} className="form-control" value={efectivo}
                onChange={(e) => setEfectivo(e.target.value ? e.target.value : 0)}
                onClick={(e) => e.target.select()}
              />
            </div>
            <div className="input-group mb-1">
              <span className="input-group-text"><i className="fa-brands fa-cc-visa me-1"></i>Tarjeta</span>
              <input type="number" min={0} className="form-control" value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value ? e.target.value : 0)}
                onClick={(e) => e.target.select()}
              />
            </div>
            <div className="input-group mb-1">
              <span className="input-group-text"><i className="fa-solid fa-credit-card me-1"></i>Puntos</span>
              <input type="number" min={0} className="form-control" value={pts}
                onChange={(e) => setPts(e.target.value ? e.target.value : 0)}
                onClick={(e) => e.target.select()}
              />
            </div>
            <strong className='text-success'>{pts > 0 && '$' + pts / 2} </strong><br />
            <strong className='h4'>{(pts > 0 || efectivo > 0 || tarjeta > 0) && 'Restante: $' + (subtotal - descuento / 100 * subtotal - pts / 2 - tarjeta - efectivo)} </strong>
          </div>
        }
        <div className="col-md-6 text-end my-3">
          {!divider &&
            <div className="row">
              <div className="col-11">
                {empleado &&
                  <select value={empleado.id} className='form-select' name="select-empleado" id="select-empleado"
                    onChange={(e) => { obtenerEmpleado(e.target.value) }}>
                    <option disabled>Empleado que realizó el servicio</option>
                    {empleados.map((empleado) => (
                      <option className='' style={{ backgroundColor: empleado.color, color: (empleado.color ? '#ffffff' : '#000000') }} key={empleado.id} value={empleado.id} >{empleado.nombre}</option>
                    ))}
                  </select>
                }
              </div>
              {empleado &&
                <div className="col-1 rounded-pill text-center text-white pt-1" style={{ background: empleado.color, width: '38px', height: '38px' }}>
                  <span className='h5'>{empleado.nombre ? empleado.nombre.substring(0, 1) : ''}</span>
                </div>
              }
            </div>
          }
          {((listaProductos.length != 0 || listaServicios.length != 0) && Object.keys(cliente).length > 0) && <button onClick={nuevoCobro} className='btn btn-success w-75 my-3'>Registrar</button>}
        </div>
      </div>
    </div>
  )
}

export default Venta