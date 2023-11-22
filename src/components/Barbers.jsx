import React, { useState, useEffect } from 'react'
import { BarberCard } from './BarberCard'
import { showAlert, addEmpleado, updateEmpleado, getActividadSemana, formatearFecha, getActividadCompleta } from '../funciones'
import './barberCard.css'
import Swal from 'sweetalert2'

const Barbers = () => {
  // const server = 'http://localhost'
  const server = import.meta.env.VITE_SERVER

  const [empleados, setEmpleados] = useState([])
  const [serviciosSemana, setServiciosSemana] = useState([])
  const [productosSemana, setProductosSemana] = useState([])
  const [servicios, setServicios] = useState([])
  const [productos, setProductos] = useState([])
  const [id, setId] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [correo, setCorreo] = useState("")
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [usuario, setUsuario] = useState("")
  const [pass, setPass] = useState("")
  const [puesto, setPuesto] = useState("")
  const [estatus, setEstatus] = useState('')
  const [foto, setFoto] = useState("")
  const [checkCatalogo, setCheckCatalogo] = useState(false)
  const [checkHorarios, setCheckHorarios] = useState(false)
  const [checkBarbers, setCheckBarbers] = useState(false)
  const [checkCaja, setCheckCaja] = useState(false)
  const [checkClientes, setCheckClientes] = useState(false)
  const [totalSemanaBarber, setTotalSemanaBarber] = useState(0)

  const [listFotos, setListFotos] = useState([])
  const [fotoActualizada, setFotoActualizada] = useState(false)

  const [operacion, setOperacion] = useState(1)
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmpleados();
  }, [])

  useEffect(() => {
    getFotos()
    setFotoActualizada(false)
  }, [fotoActualizada])

  const getFotos = () => {
    fetch(`${server}/fotos-empleados`)
      .then(res => res.json())
      .then(res => setListFotos(res))
      .catch(err => {
        alert.error(err)
      })
  }

  const getEmpleados = () => {
    let emp = []
    let permisos = []
    axios.get(`${server}/empleados`).then((response) => {
      emp = response.data
    }).then(() => {
      axios.get(`${server}/permisos`).then((res2) => {
        permisos = res2.data
      }).then(() => {
        emp.forEach(empleado => {
          empleado.permisos = []
          permisos.forEach(permiso => {
            if (empleado.id === permiso.idEmpleado) {
              empleado.permisos.push(permiso.permiso)
            }
          });
        });
      })
    }).finally(() => {
      setEmpleados(emp)
      setLoading(false)
    })
  }

  const openModal = (op, id, nombre, telefono, correo, fechaInicio, fechaNacimiento, usuario, pass, puesto, estatus, permisos, foto) => {
    setId(null)
    setNombre("")
    setTelefono("")
    setCorreo("")
    setFechaInicio("")
    setFechaNacimiento("")
    setUsuario("")
    setPass("")
    setPuesto("")
    setEstatus("")
    setFoto(null)
    setOperacion(op)
    setCheckCatalogo(permisos.includes('catalogo'))
    setCheckHorarios(permisos.includes('horarios'))
    setCheckBarbers(permisos.includes('barbers'))
    setCheckCaja(permisos.includes('caja'))
    setCheckClientes(permisos.includes('clientes'))

    if (op === 1) {
      document.getElementById('btnAceptar').className = "btn btn-success"
      setTitle('Registrar nuevo empleado')
      document.getElementById('lblTitle').className = "h4 text-success"
    } else if (op === 2) {
      document.getElementById('btnAceptar').className = "btn btn-warning"
      setTitle('Editar datos del empleado')
      document.getElementById('lblTitle').className = "h4 text-warning"

      setId(id)
      setNombre(nombre)
      if (telefono) setTelefono(telefono)
      if (correo) setCorreo(correo)
      if (usuario) setUsuario(usuario)
      if (pass) setPass(pass)
      if (puesto) setPuesto(puesto)
      if (estatus) setEstatus(estatus)
      if (foto) setFoto(foto)
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
      if (fechaInicio != null) {
        const date = new Date(fechaInicio);
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1; // Months start at 0!
        let dd = date.getUTCDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const fechaFormateada = yyyy + '-' + mm + '-' + dd;
        setFechaInicio(fechaFormateada)
      }
    }
    window.setTimeout(function () {
      document.getElementById('nombre').focus();
    }, 500)
  }

  const validar = () => {
    if (nombre.trim() === '') {
      showAlert('Escribe el nombre del empleado', 'warning')
    } else {
      if (operacion === 1) {
        addEmpleado(nombre, telefono, correo, usuario, pass, puesto, estatus, foto, fechaInicio, fechaNacimiento, getEmpleados)
      } else {
        updateEmpleado(checkCatalogo, checkHorarios, checkBarbers, checkCaja, checkClientes, nombre, telefono, correo, usuario, pass, puesto, estatus, foto, fechaInicio, fechaNacimiento, id, getEmpleados)
      }
      document.getElementById('btnCerrarModal').click()
    }
  }

  const deleteEmpleado = (id, nombre) => {
    Swal.fire({
      title: "¿Seguro de eliminar toda la información de " + nombre + "?",
      icon: "question", text: "No se puede revertir",
      showCancelButton: true, confirmButtonText: "Si, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "red"
    }).then((result) => {
      if (result.isConfirmed) {
        const instruccion = server + '/delete-empleado/' + id
        axios.delete(instruccion).then(() => {
          showAlert("Empleado mandado al carajo", 'success')
        }).finally(() => {
          getEmpleados();
        })
      } else {
        showAlert("No se eliminó ningún dato", "info")
      }
    })
  }

  const contenedor = document.getElementById("contenedor")
  const scrollLeft = () => {
    contenedor.scrollLeft += 800;
  }
  const scrollRight = () => {
    contenedor.scrollLeft -= 800;
  }

  const calcularTotal = (lista1, lista2) => {
    let total = 0
    lista1.forEach(servicio => {
      total += servicio.precioActual
    });
    lista2.forEach(item => {
      total += item.precioActual
    })
    setTotalSemanaBarber(total)
  }

  return (
    <div className="container">
      <div className="d-grid mx-auto">
        <button onClick={() => openModal(1)} className='btn btn-dark w-50 mx-auto' data-bs-toggle='modal' data-bs-target='#modalEmpleados'>
          <i className="fa-solid fa-circle-plus"></i> Añadir
        </button>
      </div>

      {loading &&
        <img className='my-4' src="src/images/caramel.gif" height={64} alt="" />
      }
      <div className="pb-5 mt-3 mb-5 border px-3 rounded bg-light shadow">
        <div className="d-flex justify-content-center">
          <div onClick={() => { scrollRight() }} className='rounded btn-flecha px-2 py-2 my-2'>
            <i className="fa-solid fa-angle-left fa-2xl"></i>
          </div>
          <div onClick={() => { scrollLeft() }} className='rounded btn-flecha px-2 py-2 my-2'>
            <i className="fa-solid fa-angle-right fa-2xl"></i>
          </div>
        </div>
        <div id='contenedor' className="div-scroll">
          <div className="row flex-row flex-nowrap">
            {
              empleados.map((empleado, i) => (
                <BarberCard key={empleado.id} empleado={empleado} image={listFotos.find((image) => image == `empleado${empleado.id}.jpeg`)} setFotoActualizada={setFotoActualizada}>
                  <div>
                    <button className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalEmpleados'
                      onClick={() => openModal(2, empleado.id, empleado.nombre, empleado.telefono, empleado.correo, empleado.fechaInicio, empleado.fechaNacimiento, empleado.usuario, empleado.pass, empleado.puesto, empleado.estatus, empleado.permisos, empleado.foto)}
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    &nbsp;
                    <button onClick={() => deleteEmpleado(empleado.id, empleado.nombre)} className="btn btn-danger">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    &nbsp;
                    <button className='btn text-white' style={{ background: 'indigo' }} data-bs-toggle='modal' data-bs-target='#modal-cobros'
                      onClick={() => { getActividadSemana(empleado.id, setServiciosSemana, setProductosSemana, setServicios, setProductos, calcularTotal); setId(empleado.id) }}
                    >
                      <span className='h6'>Actividades semana</span>
                    </button>
                  </div>
                </BarberCard>
              ))
            }
          </div>
        </div>
      </div>



      <div id='modalEmpleados' className="modal fade" aria-hidden='true'>
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
                <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                <input type="text" className="form-control" id='correo' placeholder='Correo electrónico' value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="row text-start text-secondary">
                <div className="col-6">
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="fa-solid fa-circle-play"></i></span>
                    <input type="date" className="form-control" id='fechaInicio' placeholder='Fecha de inicio' value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-6 pt-2">
                  <strong>Fecha de inicio</strong>
                </div>
              </div>

              <div className="row text-start text-secondary">
                <div className="col-6">
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="fa-solid fa-cake-candles"></i></span>
                    <input type="date" className="form-control" id='fechaNacimiento' placeholder='Cumpleaños' value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-6 pt-2">
                  <strong>Fecha de nacimiento</strong>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="fa-solid fa-id-badge"></i></span>
                    <input type="text" className="form-control" id='usuario' placeholder='Usuario' value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
                    <input type="password" className="form-control" id='pass' placeholder='Contraseña' value={pass}
                      onChange={(e) => setPass(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="fa-solid fa-briefcase"></i></span>
                    <select value={puesto} onChange={(e) => setPuesto(e.target.value)} className='form-select' name="select-puesto" id="select-puesto">
                      <option disabled>Puesto</option>
                      <option value='Administrador' >Administrador</option>
                      <option value='Barber' >Barber</option>
                      <option value='Lady barber' >Lady barber</option>
                      <option value='Auxiliar' >Auxiliar</option>
                      <option value='Encargado' >Encargado</option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="fa-solid fa-arrow-down-up-across-line"></i></span>
                    <select value={estatus} onChange={(e) => setEstatus(e.target.value)} className='form-select' name="select-estatus" id="select-estatus">
                      <option disabled>Estatus</option>
                      <option value='A'>Activo</option>
                      <option value='I'>Inactivo</option>
                      <option value='V'>Vacaciones</option>
                      <option value='B'>Baja</option>
                      <option value='P'>Pausa</option>
                    </select>
                  </div>
                </div>
                <div className="col-5 text-start rounded border mx-2 my-3 py-3 px-3">
                  <h5 className='text-warning'>Permisos</h5>
                  <div className="form-check form-switch">
                    <input onChange={(e) => setCheckCatalogo(e.target.checked)} checked={checkCatalogo} className="form-check-input" type="checkbox" role="switch" id="catalogo" />
                    <label className="form-check-label" htmlFor="catalogo">Catálogo</label>
                  </div>
                  <div className="form-check form-switch">
                    <input onChange={(e) => setCheckHorarios(e.target.checked)} checked={checkHorarios} className="form-check-input" type="checkbox" role="switch" id="horarios" />
                    <label className="form-check-label" htmlFor="horarios">Horarios</label>
                  </div>
                  <div className="form-check form-switch">
                    <input onChange={(e) => setCheckBarbers(e.target.checked)} checked={checkBarbers} className="form-check-input" type="checkbox" role="switch" id="barbers" />
                    <label className="form-check-label" htmlFor="barbers">Barbers</label>
                  </div>
                  <div className="form-check form-switch">
                    <input onChange={(e) => setCheckCaja(e.target.checked)} checked={checkCaja} className="form-check-input" type="checkbox" role="switch" id="caja" />
                    <label className="form-check-label" htmlFor="caja">Caja</label>
                  </div>
                  <div className="form-check form-switch">
                    <input onChange={(e) => setCheckClientes(e.target.checked)} checked={checkClientes} className="form-check-input" type="checkbox" role="switch" id="clientes" />
                    <label className="form-check-label" htmlFor="clientes">Clientes</label>
                  </div>
                </div>
              </div>
              <div>
                <button id='btnCerrarModal' type='button' className="btn btn-secondary me-3" data-bs-dismiss='modal'>
                  <i className="fa-solid fa-xmark me-2" />Cancelar
                </button>
                <button onClick={() => validar()} id='btnAceptar' className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk me-2" />Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id='modal-cobros' className="modal fade" aria-hidden='true'>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className='text-center' style={{ color: serviciosSemana.length > 0 ? serviciosSemana[0].color : '' }}>Actividad en la semana de {serviciosSemana.length > 0 && serviciosSemana[0].barber}</h4>              <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className="modal-body text-start">
              <div className='my-4 mx-5 px-1 py-1 border rounded'>
                <div className="table-responsive">
                  <table className='table text-center'>
                    <thead>
                      <tr>
                        <th className='text-start'>Producto o servicio</th>
                        <th className='text-start'>Cliente</th>
                        <th>Precio</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviciosSemana.map((servicio) => (
                        <tr key={servicio.id}>
                          <td className='text-start'>{servicio.servicio}</td>
                          <td className='text-start'>{servicio.cliente}</td>
                          <td>$ {servicio.precioActual * servicio.cantidad}</td>
                          <td>{formatearFecha(servicio.fecha)}</td>
                        </tr>
                      ))}
                      {productosSemana.map((producto) => (
                        <tr key={producto.id}>
                          <td className='text-start'>{producto.producto}</td>
                          <td className='text-start'>{producto.cliente}</td>
                          <td>$ {producto.precioActual * producto.cantidad}</td>
                          <td>{formatearFecha(producto.fecha)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className='h5'>Servicios: {serviciosSemana.length}</td>
                        <td className='h5'>Productos: {productosSemana.length}</td>
                        <td className='h5'>${totalSemanaBarber}</td>
                        <td></td>
                      </tr>

                    </tfoot>
                  </table>
                  <div className='text-center'>
                    {(servicios.length == 0 && productos.length == 0) && <button onClick={() => getActividadCompleta(id, setServicios, setProductos)} className='btn btn-primary my-3'>Mostrar todo</button>}
                  </div>
                  {(servicios.length > 0 || productos.length > 0) &&
                    <div className='bg-dark py-1 px-1 rounded'>
                      <table className='table text-center table-dark'>
                        <thead>
                          <tr>
                            <th className='text-start'>Producto o servicio</th>
                            <th className='text-start'>Cliente</th>
                            <th>Precio</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {servicios.map((servicio) => (
                            <tr key={servicio.id}>
                              <td className='text-start'>{servicio.servicio}</td>
                              <td className='text-start'>{servicio.cliente}</td>
                              <td>$ {servicio.precioActual * servicio.cantidad}</td>
                              <td>{formatearFecha(servicio.fecha)}</td>
                            </tr>
                          ))}
                          {productos.map((producto) => (
                            <tr key={producto.id}>
                              <td className='text-start'>{producto.producto}</td>
                              <td className='text-start'>{producto.cliente}</td>
                              <td>$ {producto.precioActual * producto.cantidad}</td>
                              <td>{formatearFecha(producto.fecha)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className='h5'>Servicios: {servicios.length}</td>
                            <td className='h5'>Productos: {productos.length}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                  }

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Barbers