import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { showAlert, addCliente, updateCliente, formatearFecha2 } from '../funciones'
import { BarraBusqueda2 } from '../components/BarraBusqueda2'

export const Clientes = ({user, clientes, setClientes }) => {
  const server = import.meta.env.VITE_SERVER
  const municipio = import.meta.env.VITE_MUNICIPIO

  const [clientesMostrados, setClientesMostrados] = useState([])
  const [cuentas, setCuentas] = useState([])
  const [id, setId] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [pts, setPts] = useState(0)
  const [genero, setGenero] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [codigoQR, setCodigoQR] = useState("")

  const [operacion, setOperacion] = useState(1)
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)

  const checkHombre = document.getElementById('checkH')
  const checkMujer = document.getElementById('checkM')

  useEffect(() => {
    getCuentas()
  }, [])

  useEffect(() => {
    setClientesMostrados(clientes)
  }, [clientes])

  useEffect(() => {
    setLoading(false)
  }, [clientesMostrados])

  const getCuentas = () => {
    axios.get(`${server}/cuentas`).then((response) => {
      setCuentas(response.data);
    }).then(() => {
      cuentas.forEach(cuenta => {
        moverCliente(cuenta.idCliente)
      });
    })
  }

  const moverCliente = (idCliente) => {
    const indice = clientes.findIndex(cliente => cliente.id === idCliente);
    const nuevoArreglo = [...clientes];
    const [cliente] = nuevoArreglo.splice(indice, 1);
    nuevoArreglo.splice(0, 0, cliente);
    setClientes(nuevoArreglo);
  };

  const openModal = (op, id, nombre, telefono, fechaNacimiento, genero, pts) => {
    setId(null)
    setNombre('')
    setTelefono('')
    setFechaNacimiento('')
    setGenero('')
    setPts(0)
    setOperacion(op)
    if (op === 1) {
      document.getElementById('btnAceptar').className = "btn btn-success"
      setTitle('Registrar nuevo cliente')
      document.getElementById('lblTitle').className = "h4 text-success"
      setGenero('H')
      checkHombre.checked = true;
    } else if (op === 2) {
      document.getElementById('btnAceptar').className = "btn btn-warning"
      setTitle('Editar datos del cliente')
      document.getElementById('lblTitle').className = "h4 text-warning"

      setId(id)
      setNombre(nombre)
      setTelefono(telefono)
      if (fechaNacimiento != null) {
        const date = new Date(fechaNacimiento);
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1; // Months start at 0!
        let dd = date.getUTCDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const fechaFormateada = yyyy + '-' + mm + '-' + dd;
        setFechaNacimiento(fechaFormateada)
      }
      setGenero(genero)
      genero === 'H' ? checkHombre.checked = true : checkMujer.checked = true;
      setPts(pts)
    }

    window.setTimeout(function () {
      document.getElementById('nombre').focus();
    }, 500)
  }

  const validar = () => {
    if (nombre.trim() === '') {
      showAlert('Escribe el nombre del cliente', 'warning')
    } else {
      if (operacion === 1) {
        addCliente(nombre, telefono, pts, genero, fechaNacimiento, codigoQR, municipio, clientes, setClientes)
      } else {
        updateCliente(nombre, telefono, pts, genero, fechaNacimiento, codigoQR, municipio, id, clientes, setClientes)
      }
      document.getElementById('btnCerrarModal').click()
    }
  }

  const deleteCliente = (id, nombre) => {
    Swal.fire({
      title: "¿Seguro de eliminar el cliente " + nombre + " ?",
      icon: "question", text: "No se puede revertir",
      showCancelButton: true, confirmButtonText: "Si, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "red"
    }).then((result) => {
      if (result.isConfirmed) {
        const instruccion = server + '/delete-cliente/' + id
        axios.delete(instruccion).then(() => {
          showAlert("Cliente eliminado", 'success')
        }).finally(() => {
          const indiceCliente = clientes.findIndex((cliente) => cliente.id === id);
          if (indiceCliente !== -1) {
            clientes.splice(indiceCliente, 1);
            setClientes([...clientes]);
          }
        })
      } else {
        showAlert("No se eliminó ningún dato", "info")
      }
    })
  }

  return (
    <div className="container">
      <div className='mt-1'>
        <BarraBusqueda2 datos={clientes} datosMostrados={clientesMostrados} setDatosMostrados={setClientesMostrados} placeholder='Buscar cliente' focus={true}></BarraBusqueda2>

      </div>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4">

          </div>

          <div className="col-md-4">
            <h6>Clientes registrados: {clientes.length}</h6>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-10 offset-0 offset-lg-1">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Pts</th>
                    <th>Cumpleaños</th>
                    <th>Municipio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {clientesMostrados.map((cliente, i) => (
                    <tr key={cliente.id}>
                      <td className='text-start'>{cliente.nombre}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.pts}</td>
                      {(new Date(new Date().getFullYear(), new Date(cliente.fechaNacimiento).getMonth(), new Date(cliente.fechaNacimiento).getDate()) > new Date(Date.now() - 432000000) && new Date(new Date().getFullYear(), new Date(cliente.fechaNacimiento).getMonth(), new Date(cliente.fechaNacimiento).getDate()) < new Date(Date.now() + 432000000))
                        ? <td style={{ background: 'linear-gradient(indigo, blue)', color: 'white', borderRadius: '.75em' }}>{new Date(cliente.fechaNacimiento).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}</td>
                        : <td>{new Date(cliente.fechaNacimiento).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}</td>}
                      {/* <td>${new Intl.NumberFormat('es-mx').format(producto.precio)}</td> */}
                      <td>{cliente.municipio == 1 ? "Teziutlán" : "Tlatlauqui"}</td>
                      <td>
                        <button className='btn btn-sm btn-warning' data-bs-toggle='modal' data-bs-target='#modalClientes'
                          onClick={() => openModal(2, cliente.id, cliente.nombre, cliente.telefono, cliente.fechaNacimiento, cliente.genero, cliente.pts)}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        &nbsp;
                        <button onClick={() => deleteCliente(cliente.id, cliente.nombre)} className="btn btn-sm btn-danger">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading &&
                <img className='my-4' src="src/images/caramel.gif" height={64} alt="" />
              }
            </div>
          </div>
        </div>
      </div>
      <div id='modalClientes' className="modal fade" aria-hidden='true'>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 id='lblTitle'>{title}</h4>
              <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className="modal-body">
              <input type="hidden" id='id' />
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-user"></i></span>
                <input type="text" className="form-control" id='nombre' placeholder='Nombre' value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-phone"></i></span>
                <input type="text" className="form-control" id='telefono' placeholder='Telefono' value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-cake-candles"></i></span>
                <input type="date" className="form-control" id='fechaNacimiento' placeholder='Cumpleaños' value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                />
              </div>
              {/* <div className="input-group mb-3 border rounded">
                <span className="input-group-text me-4"><i className="fa-solid fa-map-location-dot"></i><span className='ms-2'>Municipio</span></span>
                <div className="checkbox-tick my-auto"
                  onChange={(e) => {
                    setMunicipio(e.target.value)
                  }}
                >
                  <label className="male me-3">
                    <input id='checkT1' type="radio" name="muni" value="1" /> Teziutlán
                    <span className="checkmark"></span>
                  </label>
                  <label className="female">
                    <input id='checkT2' type="radio" name="muni" value="2" /> Tlatlauqui
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div> */}
              <div className="input-group mb-3 border rounded">
                <span className="input-group-text me-4"><i className="fa-solid fa-venus-mars"></i><span className='ms-2'>Género</span></span>
                <div className="checkbox-tick my-auto"
                  onChange={(e) => {
                    setGenero(e.target.value)
                  }}
                >
                  <label className="male me-3">
                    <input id='checkH' type="radio" name="gender" value="H" /> Hombre
                    <span className="checkmark"></span>
                  </label>
                  <label className="female">
                    <input id='checkM' type="radio" name="gender" value="M" /> Mujer
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>

              {operacion === 2 && (
                <div className="input-group mb-3">
                  <span className="input-group-text"><i className="fa-solid fa-credit-card"></i></span>
                  <input type="number" min={0} className="form-control" id='fechaNacimiento' value={pts}
                    onChange={(e) => setPts(e.target.value)}
                  />
                </div>
              )}

              <div>
                <button id='btnCerrarModal' type='button' className="btn btn-secondary me-3" data-bs-dismiss='modal'>
                  <i className="fa-solid fa-xmark me-2" />Cancelar
                </button>
                <button disabled={!user.permisos.includes('editar')} onClick={() => validar()} id='btnAceptar' className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk me-2" />Guardar
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>

  )
}

export default Clientes