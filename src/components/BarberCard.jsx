import React, { useEffect, useState } from 'react'
import './barberCard.css'
import { updateFotoEmpleado } from '../funciones'

export const BarberCard = ({ children, empleado }) => {
    const [urlFoto, setUrlFoto] = useState("/src/images/barber-profile.webp")

    const opciones = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

    useEffect(() => {
        if (empleado.foto) {
            addBlob(empleado.foto)
        }
    }, [])

    const addBlob = (buffer) => {
        const blob = new Blob(buffer.data, { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setUrlFoto(imageUrl)
        console.log(imageUrl)
    }

    function uploadImagen(input) {
        let imagen = input.files[0]
        blobToBase64(imagen)
        // const blob = fetch(`data:${imagen.type};base64,${imagen}`)
        // console.log(blob)
    }

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                setUrlFoto(reader.result)
                console.log(reader.result)
                resolve(reader.result.split(',')[1])
            }
            // updateFotoEmpleado(res.split(',')[1], empleado.id)
        })
    }

    return (
        <div className="col-xs-12 col-md-6 col-xl-4 mx-3">
            <div className="card shadow-sm">
                <div className="image-upload">
                    <form action="src/imagenes/profile" encType='multipart/form-data'>
                        <label htmlFor={"file-input" + empleado.id} >
                            <img src={urlFoto} className="card-img-top w-50" alt="Click aquí para subir tu foto" title="Click aquí para subir imagen" />
                        </label>
                        <input onChange={(input) => { uploadImagen(input.target) }} id={"file-input" + empleado.id} type="file" />
                    </form>
                </div>

                <div className="card-body">
                    <h5 className="card-title ">{empleado.nombre}</h5>
                    <strong className='text-info'>Teléfono </strong><p className=" card-text">{empleado.telefono}</p>
                    <strong className='text-info'>Correo </strong><p className=" card-text">{empleado.correo}</p>
                    <strong className='text-info'>Fecha de nacimiento </strong><p className=" card-text">{empleado.fechaNacimiento ? new Date(empleado.fechaNacimiento).toLocaleDateString('es-mx', opciones) : ""}</p>
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
                    {children}
                </div>
            </div>
        </div>
    )
}