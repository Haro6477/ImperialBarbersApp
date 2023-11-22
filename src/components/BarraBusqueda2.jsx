import React from 'react'

export const BarraBusqueda2 = ({ datos = [], setDatosMostrados, placeholder = 'Placeholder', focus = false }) => {

  const buscar = (inputText) => {
    setDatosMostrados(datos.filter(dato => removeAccents((dato.nombre + ' ' + dato.marca + ' ' + dato.linea).toLowerCase()).trim().includes(removeAccents(inputText.toLowerCase()).trim())))
  }

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  return (
    <div>
      <input type="search" autoFocus={focus} className='form-control rounded-pill icono-placeholder' placeholder={placeholder}
        onChange={(e) => buscar(e.target.value)}
      />
    </div>
  )
}
