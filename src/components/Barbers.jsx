import React, { useState, useEffect } from 'react'
import { BarberCard } from './BarberCard'
import { showAlert, addEmpleado, updateEmpleado } from '../funciones'
import './barberCard.css'
import Swal from 'sweetalert2'

const Barbers = () => {
  // const server = 'http://localhost'
  const server = import.meta.env.VITE_SERVER

  const [empleados, setEmpleados] = useState([])
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

  const [operacion, setOperacion] = useState(1)
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmpleados();
  }, [])

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

  const openModal = (op, id, nombre, telefono, correo, fechaInicio, fechaNacimiento, usuario, pass, puesto, estatus, foto) => {
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
        addEmpleado(nombre, telefono, correo, usuario, pass, puesto, estatus, foto, fechaInicio, fechaNacimiento)
      } else {
        updateEmpleado(nombre, telefono, correo, usuario, pass, puesto, estatus, foto, fechaInicio, fechaNacimiento, id)
      }
      document.getElementById('btnCerrarModal').click()
      getEmpleados()
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
    contenedor.scrollLeft += 400;
  }
  const scrollRight = () => {
    contenedor.scrollLeft -= 400;
  }

  return (
    <div className="container">
      <div className="d-grid mx-auto">
        <button onClick={() => openModal(1)} className='btn btn-dark w-50 mx-auto' data-bs-toggle='modal' data-bs-target='#modalEmpleados'>
          <i className="fa-solid fa-circle-plus"></i> Añadir
        </button>
      </div>

      {loading &&
        <i className="fa-solid fa-compact-disc fa-spin fa-2xl my-5" />
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
                <BarberCard key={empleado.id} empleado={empleado}>
                  <div>
                    <button className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalEmpleados'
                      onClick={() => openModal(2, empleado.id, empleado.nombre, empleado.telefono, empleado.correo, empleado.fechaInicio, empleado.fechaNacimiento, empleado.usuario, empleado.pass, empleado.puesto, empleado.estatus, empleado.foto)}
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    &nbsp;
                    <button onClick={() => deleteEmpleado(empleado.id, empleado.nombre)} className="btn btn-danger">
                      <i className="fa-solid fa-trash"></i>
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
                  <option value='R'>Retirado</option>
                  <option value='D'>Desaparecido</option>
                  <option value='P'>Pausa</option>
                </select>
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
    </div>
  )
}

export default Barbers