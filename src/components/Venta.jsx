import React, { useCallback, useEffect, useState } from 'react'
import '../estilos/forms.css'
import { addCobro, showAlert } from '../funciones'
import { ImprimirTicket } from '../Impresiones'
import { BarraBusqueda } from './BarraBusqueda'

const Venta = ({ user }) => {
  // const server = 'http://localhost'
  const server = import.meta.env.VITE_SERVER

  const [productos, setProductos] = useState([])
  const [servicios, setServicios] = useState([])
  const [clientes, setClientes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)

  const [cumple, setCumple] = useState(false)

  const [txtCliente, setTxtCliente] = useState("")
  const [txtProServ, setTxtProServ] = useState("")

  const [cliente, setCliente] = useState({})
  const [itemLista, setItem] = useState({})
  const [listaProductos, setListaProductos] = useState([])
  const [listaServicios, setListaServicios] = useState([])
  const [cantidad, setCantidad] = useState(1)
  const [total, setTotal] = useState(0)
  const [ptsAcumulados, setPtsAcumulados] = useState(0)
  const [metodoPago, setMetodoPago] = useState('e')
  const [idBarber, setIdBarber] = useState(user.id)
  const [nombreBarber, setNombreBarber] = useState(user.nombre)

  // Montos de pago
  const [efectivo, setEfectivo] = useState(0)
  const [pts, setPts] = useState(0)
  const [tarjeta, setTarjeta] = useState(0)

  const inputCliente = document.getElementById('input1')
  const dropClientes = document.getElementById("drop1")
  const inputProServ = document.getElementById('input2')
  const dropProServ = document.getElementById("drop2")
  const tbody = document.getElementById("tbody")
  const spanPts = document.getElementById('spanPts')

  const classInputNone = 'd-none'
  const classInputBlock = 'w-100 d-block form-select text-secondary'

  useEffect(() => {
    getClientes();
    getProductos();
    getServicios();
    getEmpleados()
  }, [])

  const getEmpleados = () => {
    axios.get(`${server}/empleados`).then((response) => {
      setEmpleados(response.data);
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
    axios.get(`${server}/productos`).then((response) => {
      setProductos(response.data);
    }).finally(setLoading(false))
  }

  const getServicios = () => {
    setLoading(true)
    axios.get(`${server}/servicios`).then((response) => {
      setServicios(response.data);
    }).finally(setLoading(false))
  }

  const dropdownProServ = (valor) => {
    setTxtProServ(valor)
    inputProServ.value == ""
      ? dropProServ.className = classInputNone
      : dropProServ.className = classInputBlock
  }

  const handleSubmit = () => {
    if (inputProServ.value == "") { return }
    dropClientes.className = classInputNone
    dropProServ.className = classInputNone
    const tr = document.createElement("tr")
    const tdCantidad = document.createElement("td")
    const tdConcepto = document.createElement("td")
    const tdPrecioUni = document.createElement("td")
    const tdSubtotal = document.createElement("td")
    tdCantidad.innerText = cantidad
    tdConcepto.innerText = itemLista.nombre
    tdConcepto.className = 'text-start'
    tdPrecioUni.innerText = itemLista.precio
    tdSubtotal.innerText = itemLista.precio * cantidad
    tr.appendChild(tdCantidad)
    tr.appendChild(tdConcepto)
    tr.appendChild(tdPrecioUni)
    tr.appendChild(tdSubtotal)
    tbody.appendChild(tr)
    itemLista.cantidad = cantidad
    inputProServ.value = ""
    itemLista.tipo === 'p' ? setListaProductos(listaProductos.concat(itemLista)) : setListaServicios(listaServicios.concat(itemLista))
    setTotal(total + itemLista.precio * cantidad)
    setPtsAcumulados(ptsAcumulados + itemLista.pts * cantidad)
    setItem({})
    setCantidad(1)
  }


  const nuevoCobro = (() => {
    switch (metodoPago) {
      case 'e':
        addCobro(cliente.id, total, ptsAcumulados, metodoPago, idBarber, user.id, total, 0, 0, listaProductos, listaServicios)
        ImprimirTicket(listaServicios, listaProductos, total, total, tarjeta, pts, cliente.nombre, user.nombre, Math.trunc(cliente.pts + ptsAcumulados))
        break;
      case 't':
        addCobro(cliente.id, total, ptsAcumulados, metodoPago, idBarber, user.id, 0, total, 0, listaProductos, listaServicios)
        ImprimirTicket(listaServicios, listaProductos, total, efectivo, total, pts, cliente.nombre, user.nombre, Math.trunc(cliente.pts + ptsAcumulados))
        break;
      case 'p':
        if (cliente.pts / 2 >= total) {
          addCobro(cliente.id, total, 0, metodoPago, idBarber, user.id, 0, 0, total * 2, listaProductos, listaServicios)
          ImprimirTicket(listaServicios, listaProductos, total, efectivo, tarjeta, total * 2, cliente.nombre, user.nombre, cliente.pts - total * 2)
        } else {
          showAlert("Puntos insuficientes", 'error')
          return
        }
        break;
      default:
        if (cliente.pts >= pts) {
          addCobro(cliente.id, total, ptsAcumulados * (1 - pts / total) - (total - (efectivo + tarjeta) / 2) / 10, metodoPago, idBarber, user.id, efectivo, tarjeta, pts, listaProductos, listaServicios)
          ImprimirTicket(listaServicios, listaProductos, total, efectivo, tarjeta, pts, cliente.nombre, nombreBarber, cliente.pts + ptsAcumulados * (1 - pts / total) - pts)
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
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild)
    }
    setTotal(0)
    inputCliente.focus()
  }

  function setSize2() {
    dropProServ.length < 7 ? dropProServ.size = dropProServ.length : dropProServ.size = 6
    if (dropProServ.length == 0) dropProServ.classList = 'd-none'
  }


  return (
    <div className='container'>
      <div className="row">
        <div className="col-sm-12 col-md-10">
          <div className='mb-3 mt-1'>
            <BarraBusqueda datos={clientes} setDato={setCliente} txtInput={txtCliente} setTxtInput={setTxtCliente} placeholder={'Clientes'} focus={true} id={1}></BarraBusqueda>
          </div>
        </div>
        <div className="col-sm-8 col-md-2 mb-3 pt-1">
          {Object.keys(cliente).length > 0 && <span className='h4 text-info' id='spanPts'>{cliente.pts} pts.</span>}
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
          <BarraBusqueda datos={servicios} datos2={productos} setDato={setItem} txtInput={txtProServ} setTxtInput={setTxtProServ} placeholder={'Servicios y productos'} id={2}></BarraBusqueda>
        </div>

        <div className="col-8 col-md-2 d-flex mx-auto my-2">
          <button onClick={() => handleSubmit()} id='btnAdd' className='btn btn-dark w-100 mx-auto'>
            <i className="fa-solid fa-circle-plus"></i> Añadir
          </button>
        </div>
      </div>

      <div className="shadow-sm resumen rounded border my-3">
        <table className="table table-borderless ">
          <thead className='table-dark align-middle'>
            <tr>
              <th>Cantidad</th>
              <th className='text-start'>Servicio o Producto</th>
              <th>Precio c/u</th>
              <th>Subtotal</th>
              <th><button className='btn btn-outline-danger'>Dividir</button></th>
            </tr>
          </thead>
          <tbody id='tbody'></tbody>
          <tfoot className='table-secondary h5'>
            <tr>
              <td></td><td></td><td></td>
              <td className='text-end'><strong>Total:</strong></td>
              <td><strong>${total}.00</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className='row mb-4 border rounded py-3 px-3 bg-light shadow-sm d-flex'>
        <div className="col">
          <h5 className='mb-3'>Método de pago</h5>
          <div className="row ">
            <div className="col align-self-center">
              <div className=" text-start ">
                <div className="form-check">
                  <input onChange={(e) => setMetodoPago('e')} className="form-check-input" type="radio" name="flexRadioDefault" id='flexRadioDefault1' value={'e'} defaultChecked />
                  <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Efectivo
                  </label>
                </div>
              </div>
            </div>
            <div className="col align-self-center">
              <div className=" text-start ">
                <div className="form-check">
                  <input onChange={(e) => setMetodoPago('t')} className="form-check-input" type="radio" name="flexRadioDefault" id='flexRadioDefault2' value={'t'} />
                  <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Tarjeta
                  </label>
                </div>
              </div>
            </div>

            <div className="col align-self-center">
              <div className=" text-start ">
                <div className="form-check">
                  <input onChange={(e) => setMetodoPago('p')} className="form-check-input" type="radio" name="flexRadioDefault" id='flexRadioDefault3' value={'p'} />
                  <label className="form-check-label" htmlFor="flexRadioDefault3">
                    Puntos
                  </label>
                </div>
              </div>
            </div>

            <div className={metodoPago != 'm' ? 'col align-self-center' : 'col align-self-center d-none'}>
              <div className=" text-start ">
                <div className="form-check">
                  <input onChange={(e) => setMetodoPago('m')} className="form-check-input" type="radio" name="flexRadioDefault" id='flexRadioDefault4' value={'m'} />
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
                onChange={(e) => setEfectivo(e.target.value)}
              />
            </div>
            <div className="input-group mb-1">
              <span className="input-group-text"><i className="fa-brands fa-cc-visa me-1"></i>Tarjeta</span>
              <input type="number" min={0} className="form-control" value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
              />
            </div>
            <div className="input-group mb-1">
              <span className="input-group-text"><i className="fa-solid fa-credit-card me-1"></i>Puntos</span>
              <input type="number" min={0} className="form-control" value={pts}
                onChange={(e) => setPts(e.target.value)}
              />
            </div>
            <strong className='text-success'>{pts > 0 && '$' + pts / 2} </strong><br />
            <strong className='h4'>{(pts > 0 || efectivo > 0 || tarjeta > 0) && 'Restante: $' + (total - pts / 2 - tarjeta - efectivo)} </strong>
          </div>
        }
        <div className="col-md-6 text-end my-3">
          <select value={idBarber} className='form-select' name="select-empleado" id="select-empleado"
            onChange={(e) => { setIdBarber(e.target.value), setNombreBarber((e.target).options[(e.target).selectedIndex].text) }}
          >

            <option disabled>Empleado que atendió</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.id} >{empleado.nombre}</option>
            ))}
          </select>
          {((listaProductos.length != 0 || listaServicios.length != 0) && Object.keys(cliente).length > 0) && <button onClick={nuevoCobro} className='btn btn-success w-75 my-3'>Registrar</button>}
        </div>
      </div>
    </div>
  )
}

export default Venta