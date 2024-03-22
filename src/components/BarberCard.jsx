import React, { useEffect, useState } from 'react'
import '../estilos/barberCard.css'
import { crearHorario, showAlert, updateFotoEmpleado } from '../funciones'

export const BarberCard = ({ children, empleado, image, getFotos }) => {
  const [urlFoto, setUrlFoto] = useState("/src/images/barber-profile.webp")
  const [imagen, setImagen] = useState(null)

  const server = import.meta.env.VITE_SERVER

  const opciones = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

  useEffect(() => {
    if (image) setUrlFoto(server + '/' + image)
  }, [image])

  const addBlob = (buffer) => {
    const blob = new Blob(buffer.data, { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    setUrlFoto(imageUrl)
  }

  function uploadImagen(input) {
    let imagen = input.files[0]
    setImagen(imagen)

    const formdata = new FormData()
    formdata.append('image', imagen)
    formdata.append('id', empleado.id)

    fetch(`${server}/update-foto-empleado`, {
      method: 'put',
      body: formdata
    })
      .then(res => res.text())
      .then(() => getFotos())
      .then(res => showAlert(res, 'success'))
      .catch(err => {
        console.error(err)
        setFotoActualizada(true)
      })
  }

  return (
    <div className="col-xs-12 col-md-6 col-xl-4 mx-3">
      <div className="card shadow-sm">
        <div className="image-upload">
          <form action="src/imagenes/profile" encType='multipart/form-data'>
            <label htmlFor={"file-input" + empleado.id} >
              <div className="cont-img-lg my-4">
                <img src={urlFoto} className="card-img-top crop" alt="Click aquí para subir tu foto" title="Click aquí para subir imagen" />
              </div>
            </label>
            <input onChange={(input) => { uploadImagen(input.target) }} id={"file-input" + empleado.id} type="file" />
          </form>
        </div>
        {children}

        <div className="card-body">
          <h5 className="card-title ">{empleado.nombre}</h5>
          
          <strong className='text-info'>Teléfono </strong><p className=" card-text">{empleado.telefono}</p>
          <strong className='text-info'>Correo </strong><p className=" card-text">{empleado.correo}</p>
          <strong className='text-info'>Fecha de nacimiento </strong><p className=" card-text">{empleado.fechaNacimiento ? new Date(empleado.fechaNacimiento).toLocaleDateString('es-mx', opciones) : ""}</p>
          <strong className='text-info'>Fecha de inicio </strong><p className=" card-text">{empleado.fechaInicio ? new Date(empleado.fechaInicio).toLocaleDateString('es-mx', opciones) : ""}</p>
          <strong className='text-info'>Municipio </strong><p className=" card-text">{empleado.municipio == 1 ? "Teziutlán" : "Tlatlauquitepec"}</p>
          <strong className='text-info'>Puesto </strong><p className=" card-text">{empleado.puesto}</p>
          <strong className='text-info'>Estado </strong><p className=" card-text">
            {empleado.estatus == 'A' && <span className='badge bg-success'>Activo</span>}
            {empleado.estatus == 'I' && <span className='badge bg-danger'>Inactivo</span>}
            {empleado.estatus == 'V' && <span className='badge bg-warning'>Vacaciones</span>}
            {empleado.estatus == 'B' && <span className='badge bg-dark'>Baja</span>}
            {empleado.estatus == 'P' && <span className='badge bg-secondary'>Pausa</span>}
          </p>
        </div>
      </div>
    </div>
  )
}