import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { getEmpleado, updatePassword, capitalize, validarFecha, showAlert } from '../funciones'
import Axios from 'axios'


export const Perfil = ({ user = {} }) => {
  const [urlFoto, setUrlFoto] = useState('/src/images/barber-profile.webp')
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [correo, setCorreo] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [usuario, setUsuario] = useState("")
  const [pass, setPass] = useState("")
  const [color, setColor] = useState("#2000000")
  const [imagen, setImagen] = useState("")
  const [empleado, setEmpleado] = useState({})

  const server = import.meta.env.VITE_SERVER

  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  const btnActualizar = document.getElementById('btnActualizar')

  useEffect(() => {
    getFoto()
    getEmpleado(user.id, setEmpleado)
  }, [])

  useEffect(() => {
    setNombre(empleado.nombre ? empleado.nombre : '')
    setTelefono(empleado.telefono ? empleado.telefono : '')
    setCorreo(empleado.correo ? empleado.correo : '')
    setFechaNacimiento(empleado.fechaNacimiento ? formatearFecha(empleado.fechaNacimiento) : '')
    setUsuario(empleado.usuario ? empleado.usuario : '')
    setPass(empleado.pass)
    setColor(empleado.color ? empleado.color : '#000000')
  }, [empleado])

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const yyyy = date.getFullYear()
    let mm = date.getMonth() + 1
    let dd = date.getUTCDate()

    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm

    const fechaFormateada = yyyy + '-' + mm + '-' + dd;
    return fechaFormateada
  }

  const getFoto = () => {
    fetch(`${server}/foto-empleado/${user.id}`)
      .then(res => res.json())
      .then(res => setUrlFoto(server + '/' + res))
      .catch(err => {
        alert.error(err)
      })
  }

  const editar = (label) => {
    label.className = 'd-none'
    label.nextSibling.className = 'form-control '
    label.nextSibling.select()
  }
  const editarPass = () => {
    Swal.fire({
      title: 'Cambiar contraseña',
      html: `<input type="password" id="passActual" class="swal2-input" placeholder="Contraseña actual">
      <input type="password" id="passNueva" class="swal2-input" placeholder="Nueva contraseña">
      <input type="password" id="passConfirm" class="swal2-input" placeholder="Confirmar contraseña">`,
      confirmButtonText: 'Comprobar',
      focusConfirm: false,
      preConfirm: () => {
        const passActual = Swal.getPopup().querySelector('#passActual').value
        const passNueva = Swal.getPopup().querySelector('#passNueva').value
        const passConfirm = Swal.getPopup().querySelector('#passConfirm').value
        if (passActual != pass) {
          Swal.showValidationMessage(`La contraseña actual es incorrecta`)
        } else if (passNueva != passConfirm) {
          Swal.showValidationMessage(`Las contraseñas no coinciden`)
        }
        return { passActual: passActual, passNueva: passNueva }
      }
    }).then((result) => {
      updatePassword(result.value.passNueva, user.id)
      Swal.fire(`Contraseña actualizada`.trim())
    })

  }
  const blur = (input, atributo) => {
    input.className = 'd-none'
    input.previousSibling.className = 'my-auto pointer'
    if (input.value != atributo) {
      btnActualizar.className = 'btn btn-warning'
    }
  }

  const editarColor = (input, atributo) => {
    if (input.value != atributo) {
      btnActualizar.className = 'btn btn-warning'
    }
  }

  function uploadImagen(input) {
    let imagen = input.files[0]
    setImagen(imagen)

    const formdata = new FormData()
    formdata.append('image', imagen)
    formdata.append('id', user.id)

    fetch(`${server}/update-foto-empleado`, {
      method: 'put',
      body: formdata
    })
      .then(res => res.text())
      .then(res => showAlert(res, 'success'))
      .catch(err => {
        console.error(err)
        setFotoActualizada(true)
      })
  }

  const updateDatos = (nombre, telefono, correo, usuario, fechaNacimiento, color, municipio) => {
    Axios.put(`${server}/update-empleado-datos`, {
      nombre: capitalize(nombre),
      telefono: telefono,
      correo: correo,
      usuario: usuario,
      fechaNacimiento: validarFecha(fechaNacimiento),
      color: color,
      id: user.id,
      municipio: municipio
    }).then(() => {
      getEmpleado(user.id, setEmpleado)
      showAlert("Datos actualizados", 'success')
    })
  }

  return (
    <div className="row mx-5 my-3 rounded w-75 mx-auto py-5">
      <div className="col">
        <div className="image-upload">
          <form action="src/imagenes/profile" encType='multipart/form-data'>
            <label htmlFor={"file-input" + user.id} >
              <div className="imagen-circular" style={{border: '7px solid ' + empleado.color}}>
                <img src={urlFoto} className="crop " style={{ maxHeight: '800px' }} alt="Click aquí para subir tu foto" title="Click aquí para subir imagen" />
              </div>
            </label>
            <input onChange={(input) => { uploadImagen(input.target) }} id={"file-input" + user.id} type="file" />
          </form>
        </div>
      </div>

      <div className='col my-auto'>

        <div className="row my-2">
          <div className="col text-end align-self-center">
            <strong className='text-info'>Nombre:</strong>
          </div>
          <div className="col text-start align-self-center">
            <h5 onClick={(e) => e.target.innerText != '' && editar(e.target)} className='my-auto pointer'>{nombre ? nombre : <i onClick={(e) => editar(e.target.parentNode)} className="fa-solid fa-pen-to-square"></i>}</h5>
            <input onKeyDown={(e) => { if (e.key == 'Enter') blur(e.target, empleado.nombre) }} onBlur={(e) => blur(e.target, empleado.nombre)} onChange={(e) => setNombre(e.target.value)} className='d-none' type="text" id='inputNombre' value={nombre} />
          </div>
        </div>
        <div className="row my-2">
          <div className="col text-end align-self-center">
            <strong className='text-info'>Telefono:</strong>
          </div>
          <div className="col text-start align-self-center">
            <h5 onClick={(e) => e.target.innerText != '' && editar(e.target)} className='my-auto pointer'>{telefono ? telefono : <i onClick={(e) => editar(e.target.parentNode)} className="fa-solid fa-pen-to-square"></i>}</h5>
            <input onKeyDown={(e) => e.key == 'Enter' && blur(e.target, empleado.telefono)} onBlur={(e) => blur(e.target, empleado.telefono)} onChange={(e) => setTelefono(e.target.value)} className='d-none' type="text" id='inputTelefono' value={telefono} />
          </div>
        </div>
        <div className="row my-2">
          <div className="col text-end align-self-center">
            <strong className='text-info'>Correo:</strong>
          </div>
          <div className="col text-start align-self-center">
            <h5 onClick={(e) => e.target.innerText != '' && editar(e.target)} className='my-auto pointer'>{correo ? correo : <i onClick={(e) => editar(e.target.parentNode)} className="fa-solid fa-pen-to-square"></i>}</h5>
            <input onKeyDown={(e) => e.key == 'Enter' && blur(e.target, empleado.correo)} onBlur={(e) => blur(e.target, empleado.correo)} onChange={(e) => setCorreo(e.target.value)} className='d-none' type="text" id='inputCorreo' value={correo} />
          </div>
        </div>
        <div className="row my-2">
          <div className="col text-end align-self-center">
            <strong className='text-info'>Fecha de nacimiento:</strong>
          </div>
          <div className="col text-start align-self-center">
            <h5 onClick={(e) => e.target.innerText != '' && editar(e.target)} className='my-auto pointer'>{fechaNacimiento ? new Date(fechaNacimiento).toLocaleDateString('es-mx', opciones) : <i onClick={(e) => editar(e.target.parentNode)} className="fa-solid fa-pen-to-square"></i>}</h5>
            <input onKeyDown={(e) => e.key == 'Enter' && blur(e.target, empleado.fechaNacimiento)} onBlur={(e) => blur(e.target, empleado.fechaNacimiento)} onChange={(e) => setFechaNacimiento(e.target.value)} className='d-none' type="date" id='fechaNacimiento' value={fechaNacimiento} />
          </div>
        </div>
        <div className="row my-2">
          <div className="col text-end align-self-center">
            <strong className='text-info'>Color:</strong>
          </div>
          <div className="col text-start align-self-center">
            <input onKeyDown={(e) => e.key == 'Enter' && editarColor(e.target, empleado.color)} onBlur={(e) => editarColor(e.target, empleado.color)} onChange={(e) => setColor(e.target.value)} className='' type="color" id='color' value={color} />
          </div>
        </div>
        <hr />
        <div className="row my-2">
          <div className="col text-end align-self-center">
            <strong className='text-info'>Nombre de usuario:</strong>
          </div>
          <div className="col text-start align-self-center">
            <h5 onClick={(e) => e.target.innerText != '' && editar(e.target)} className='my-auto pointer'>{usuario ? usuario : <i onClick={(e) => editar(e.target.parentNode)} className="fa-solid fa-pen-to-square"></i>}</h5>
            <input onKeyDown={(e) => e.key == 'Enter' && blur(e.target, empleado.usuario)} onBlur={(e) => blur(e.target, empleado.usuario)} onChange={(e) => setUsuario(e.target.value)} className='d-none' type="email" id='inputUsuario' value={usuario} />
          </div>
        </div>
        <div className="row my-2">
          <div className="col text-end align-self-center">
            <strong className='text-info'>Contraseña:</strong>
          </div>
          <div className="col text-start align-self-center">
            <h5 onClick={(e) => e.target.innerText != '' && editarPass()} className='my-auto pointer'>{<i onClick={(e) => editarPass()} className="fa-solid fa-pen-to-square"></i>}</h5>
          </div>
        </div>
        <hr />
        <strong className='text-info'>Fecha de inicio </strong><p className=" card-text">{empleado.fechaInicio ? new Date(empleado.fechaInicio).toLocaleDateString('es-mx', opciones) : ""}</p>
        <strong className='text-info'>Puesto </strong><p className=" card-text">{empleado.puesto}</p>
        <strong className='text-info'>Estado </strong><p className=" card-text">
          {empleado.estatus == 'A' && <span className='badge bg-success'>Activo</span>}
          {empleado.estatus == 'I' && <span className='badge bg-danger'>Inactivo</span>}
          {empleado.estatus == 'V' && <span className='badge bg-warning'>Vacaciones</span>}
          {empleado.estatus == 'R' && <span className='badge bg-dark'>Retirado</span>}
          {empleado.estatus == 'D' && <span className='badge bg-primary'>Desaparecido</span>}
          {empleado.estatus == 'P' && <span className='badge bg-secondary'>Pausa</span>}
        </p>
        <button id='btnActualizar' onClick={() => updateDatos(nombre, telefono, correo, usuario, fechaNacimiento, color, empleado.municipio)} className='d-none'>Actualizar</button>
      </div>
    </div>
  )
}
