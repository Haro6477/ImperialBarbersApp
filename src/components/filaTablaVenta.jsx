import React, { useState, useEffect } from 'react'

export const FilaTablaVenta = ({ divider = false, item, listaItems = [], setLista, empleados = [], index = 0 }) => {
  const [empleadoFila, setEmpleadoFila] = useState(empleados[0])
  const [cantidadFila, setCantidadFila] = useState(item.cantidad)

  const obtenerEmpleadoFila = (id) => {
    const empleadoSeleccionado = (empleados.find((e) => e.id == id))
    setEmpleadoFila(empleadoSeleccionado)

    const listaActualizada = [...listaItems];
    listaActualizada[index] = {
      ...listaActualizada[index],
      idBarber: id
    };
    setLista(listaActualizada);
  }
  const cambiarCantidadFila = (cant) => {
    const listaActualizada = [...listaItems];
    listaActualizada[index] = {
      ...listaActualizada[index],
      cantidad: cant
    };
    setLista(listaActualizada);
  }
  const quitarItem = () => {
    const listaActualizada = [...listaItems];
    listaActualizada.splice(index, 1);
    setLista(listaActualizada);
  }

  useEffect(() => {

  }, [])

  return (
    <tr>
      <td>
        <div className="row">
          <div className="col"><i className="fa-solid fa-trash " style={{ color: '#c81919', cursor:'pointer' }} onClick={() => { quitarItem() }}></i></div>
          <div className="col"><input onChange={(e) => cambiarCantidadFila(e.target.value)} type="number" className='form-control shadow border border-secondary' style={{ maxWidth: '5rem' }} min={1} value={item.cantidad} /></div>
        </div>
      </td>
      <td>{item.nombre}</td>
      <td>{item.precio}</td>
      <td>{item.precio * item.cantidad}</td>
      {divider &&
        <td>
          <div className="row w-100">
            <div className="col-10">
              {empleadoFila &&
                <select value={empleadoFila.id} className='form-select' name={"select-empleado" + empleadoFila.id} id={"select-empleado" + empleadoFila.id}
                  onChange={(e) => { obtenerEmpleadoFila(e.target.value) }}>
                  <option disabled>Empleado que realizó el servicio</option>
                  {empleados.map((empleado) => (
                    <option style={{ background: empleado.color, color: (empleado.color ? '#ffffff' : '#000000') }} key={empleado.id} value={empleado.id} >{empleado.nombre}</option>
                  ))}
                </select>
              }
            </div>
            {empleadoFila &&
              <div className="col-1 rounded-pill text-center text-white pt-1" style={{ background: empleadoFila.color, width: '35px', height: '35px' }}>
                <span className='h5'>{empleadoFila.nombre ? empleadoFila.nombre.substring(0, 1) : ''}</span>
              </div>
            }
          </div>
        </td>
      }
    </tr>
  )
}
