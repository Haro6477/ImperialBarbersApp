import React, { useEffect, useState } from 'react'
import { showAlert, addProducto, updateProducto, addServicio, updateServicio } from '../funciones'
import '../estilos/forms.css'
import { BarraBusqueda2 } from './BarraBusqueda2'
import Swal from 'sweetalert2'


const Catalogo = () => {
  // const server = 'http://localhost'
  const server = import.meta.env.VITE_SERVER

  const [productos, setProductos] = useState([])
  const [servicios, setServicios] = useState([])

  const [productosMostrados, setProductosMostrados] = useState([])
  const [serviciosMostrados, setServiciosMostrados] = useState([])

  const [loadingProductos, setLoadingPro] = useState(true)
  const [loadingServicios, setLoadingServ] = useState(true)
  const [operacion, setOperacion] = useState(1)
  const [title, setTitle] = useState("")

  const [id, setId] = useState("")
  const [nombre, setNombre] = useState("")
  const [marca, setMarca] = useState("")
  const [linea, setLinea] = useState("")
  const [contenido, setContenido] = useState("")
  const [enVenta, setEnVenta] = useState("")
  const [suministros, setSuministros] = useState("")
  const [almacen, setAlmacen] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [costo, setCosto] = useState("")
  const [precio, setPrecio] = useState("")
  const [pts, setPts] = useState("")
  const [imagen, setImagen] = useState("")

  const btnEliminarProducto = document.getElementById('btnEliminarP')
  const btnEliminarServicio = document.getElementById('btnEliminarS')


  useEffect(() => {
    getProductos();
    getServicios();
  }, [])

  const getProductos = () => {
    setLoadingPro(true)
    axios.get(`${server}/productos`).then((response) => {
      setProductos(response.data);
      setProductosMostrados(response.data)
    }).finally(setLoadingPro(false))
  }

  const getServicios = () => {
    axios.get(`${server}/servicios`).then((response) => {
      setServicios(response.data);
      setServiciosMostrados(response.data)
    }).finally(setLoadingServ(false))
  }


  const openModalProductos = (op, id, nombre, marca, linea, contenido, enVenta, suministros, almacen, descripcion, costo, precio, pts, imagen) => {
    setId(null)
    setNombre('')
    setMarca('')
    setLinea('')
    setContenido('')
    setEnVenta(0)
    setSuministros(0)
    setAlmacen(0)
    setDescripcion('')
    setCosto(0)
    setPrecio(0)
    setPts(0)
    setImagen('')

    setOperacion(op)

    if (op === 1) {
      btnEliminarProducto.className = "d-none"
      document.getElementById('btnAceptar').className = "btn btn-success"
      setTitle('Registrar nuevo producto')
      document.getElementById('lblTitle').className = "h4 text-success"
    } else if (op === 2) {
      btnEliminarProducto.className = "btn btn-danger me-3 my-3"
      document.getElementById('btnAceptar').className = "btn btn-warning"
      setTitle('Editar datos del producto')
      document.getElementById('lblTitle').className = "h4 text-warning"

      setId(id)
      setNombre(nombre)
      setMarca(marca)
      setLinea(linea)
      setContenido(contenido)
      setEnVenta(enVenta)
      setSuministros(suministros)
      setAlmacen(almacen)
      descripcion != null ? setDescripcion(descripcion) : setDescripcion('')
      setCosto(costo)
      setPrecio(precio)
      setPts(pts)
      setImagen(imagen)
    }

    window.setTimeout(function () {
      document.getElementById('nombre').focus();
    }, 500)
  }

  const openModalServicios = (op, id, nombre, descripcion, precio, pts) => {
    setId(null)
    setNombre('')
    setDescripcion('')
    setPrecio(0)
    setPts(0)

    setOperacion(op)

    if (op === 1) {
      btnEliminarServicio.className="d-none"
      document.getElementById('btnAceptarS').className = "btn btn-success"
      setTitle('Registrar nuevo servicio')
      document.getElementById('lblTitleS').className = "h4 text-success"
    } else if (op === 2) {
      btnEliminarServicio.className="btn btn-danger me-3 my-3"
      document.getElementById('btnAceptarS').className = "btn btn-warning"
      setTitle('Editar datos del servicio')
      document.getElementById('lblTitleS').className = "h4 text-warning"

      setId(id)
      setNombre(nombre)
      descripcion != null ? setDescripcion(descripcion) : setDescripcion('')
      setPrecio(precio)
      setPts(pts)
      setImagen(imagen)
    }
    window.setTimeout(function () {
      document.getElementById('nombreS').focus();
    }, 500)
  }

  const validarProducto = () => {
    if (nombre.trim() === '') {
      showAlert('Escribe el nombre', 'warning')
    } else {
      if (operacion === 1) {
        addProducto(nombre, marca, linea, contenido, enVenta, suministros, almacen, descripcion, costo, precio, pts, getProductos)
      } else {
        updateProducto(nombre, marca, linea, contenido, enVenta, suministros, almacen, descripcion, costo, precio, pts, id, getProductos)
      }
      document.getElementById('btnCerrarModal').click()
    }
  }

  const validarServicio = () => {
    if (nombre.trim() === '') {
      showAlert('Escribe el nombre', 'warning')
    } else {
      if (operacion === 1) {
        addServicio(nombre, descripcion, precio, pts, getServicios)
      } else {
        updateServicio(nombre, descripcion, precio, pts, id, getServicios)
      }
      document.getElementById('btnCerrarModalS').click()
    }
  }

  const eliminarServicio = () => {
    Swal.fire({
      title: "¿Seguro de eliminar el servicio " + nombre + " ?",
      icon: "question", text: "No se puede revertir",
      showCancelButton: true, confirmButtonText: "Si, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "red"
    }).then((result) => {
      if (result.isConfirmed) {
        const instruccion = server + '/delete-servicio/' + id
        axios.delete(instruccion).then(() => {
          showAlert("Servicio eliminado", 'success')
        }).finally(() => {
          getServicios();
          document.getElementById('btnCerrarModalS').click()
        })
      } else {
        showAlert("No se eliminó ningún dato", "info")
      }
    })
  }

  const eliminarProducto = () => {
    Swal.fire({
      title: "¿Seguro de eliminar el producto " + nombre + " de " + marca + " ?",
      icon: "question", text: "No se puede revertir",
      showCancelButton: true, confirmButtonText: "Si, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "red"
    }).then((result) => {
      if (result.isConfirmed) {
        const instruccion = server + '/delete-producto/' + id
        axios.delete(instruccion).then(() => {
          showAlert("Producto eliminado", 'success')
        }).finally(() => {
          getProductos();
          document.getElementById('btnCerrarModal').click()
        })
      } else {
        showAlert("No se eliminó ningún dato", "info")
      }
    })
  }

  return (
    <div className="px-5">
      <div className="row d-flex justify-content-center">
        <div className="col rounded bg-dark mx-3 mb-5">
          <div className="row my-2">
            <div className="col"></div>
            <div className="col"><h2 className='text-light '>Productos</h2></div>
            <div className="col text-end">
              <button className='btn btn-info' data-bs-toggle='modal' data-bs-target='#modal-productos' onClick={() => openModalProductos(1)}>
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="my-3 px-5">
            <BarraBusqueda2 setDatosMostrados={setProductosMostrados} datos={productos} focus={true} placeholder='Buscar producto' ></BarraBusqueda2>
          </div>
          <table className='table table-dark table-sm'>
            <thead>
              <tr>
                <th className='text-start'>Producto</th>
                <th>Contenido</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {productosMostrados.map((producto) => (
                <tr key={producto.id} className='hover' data-bs-toggle='modal' data-bs-target='#modal-productos'
                  onClick={() => openModalProductos(2, producto.id, producto.nombre, producto.marca, producto.linea, producto.contenido, producto.enVenta, producto.suministros, producto.almacen, producto.descripcion, producto.costo, producto.precio, producto.pts, producto.imagen)}>
                  <td className='text-start'>{producto.nombre + ' ' + producto.marca + ' ' + producto.linea}</td>
                  <td>{producto.contenido}</td>
                  <td>{producto.precio}</td>
                  <td>{+producto.almacen + +producto.enVenta == 0 ? '-' : +producto.almacen + +producto.enVenta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col rounded bg-dark mx-3 mb-5">
          <div className="row my-2">
            <div className="col"></div>
            <div className="col"><h2 className='text-light my-2'>Servicios</h2></div>
            <div className="col text-end">
              <button className='btn btn-info' data-bs-toggle='modal' data-bs-target='#modal-servicios' onClick={() => openModalServicios(1)}>
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          <div className="my-3 px-5">
            <BarraBusqueda2 setDatosMostrados={setServiciosMostrados} datos={servicios} placeholder='Buscar servicio' ></BarraBusqueda2>
          </div>

          <table className='table table-dark table-sm'>
            <thead>
              <tr>
                <th className='text-start'>Servicio</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {serviciosMostrados.map((servicio) => (
                <tr key={servicio.id} className='hover' data-bs-toggle='modal' data-bs-target='#modal-servicios'
                  onClick={() => openModalServicios(2, servicio.id, servicio.nombre, servicio.descripcion, servicio.precio, servicio.pts)}
                >
                  <td className='text-start'>{servicio.nombre}{' '}{servicio.contenido}</td>
                  <td>{servicio.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div id='modal-productos' className="modal fade" aria-hidden='true'>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 id='lblTitle'>{title}</h4>
              <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className="modal-body">

              <div className="input-group mb-2">
                <span className="input-group-text"><i className="fa-solid fa-bottle-droplet"></i></span>
                <input type="text" className="form-control" id='nombre' placeholder='Nombre' value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="input-group mb-2">
                <span className="input-group-text"><i className="fa-solid fa-copyright"></i></span>
                <input type="text" className="form-control" id='marca' placeholder='Marca' value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                />
                <span className="input-group-text"><i className="fa-solid fa-check-to-slot"></i></span>
                <input type="text" className="form-control" id='linea' placeholder='Linea' value={linea}
                  onChange={(e) => setLinea(e.target.value)}
                />
              </div>

              <div className="input-group mb-2">
                <span className="input-group-text"><i className="fa-solid fa-prescription-bottle"></i></span>
                <input type="text" className="form-control" id='contenido' placeholder='Contenido' value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                />
              </div>

              <div className="row">
                <div className="col">
                  <label htmlFor="enVenta">Venta</label>
                  <div className=" input-group mb-2">
                    <input type="number" className="form-control" id='enVenta' placeholder='En venta' value={enVenta}
                      onChange={(e) => setEnVenta(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col">
                  <label htmlFor="totalAlmacen">Almacen</label>
                  <div className=" input-group mb-2">
                    <input type="number" className="form-control" id='totalAlmacen' placeholder='Almacen' value={almacen}
                      onChange={(e) => setAlmacen(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col">
                  <label htmlFor="suministros">Suministros</label>
                  <div className=" input-group mb-2">
                    <input type="number" className="form-control" id='suministros' placeholder='Suministros' value={suministros}
                      onChange={(e) => setSuministros(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col">
                  <label htmlFor="stock">Stock</label>
                  <h4 id='stock'>{+enVenta + +almacen}</h4>
                </div>
              </div>
              <div className="form-floating">
                <textarea className="form-control my-2" placeholder="Descripción" id="floatingTextarea2" style={{ height: '120px' }}
                  value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                >
                </textarea>
                <label htmlFor="floatingTextarea2">Descripción</label>
              </div>

              <div className="row">
                <div className="col">
                  <label htmlFor="costo">Costo</label>
                  <div className="input-group mb-2">
                    <input type="number" className="form-control" id='costo' placeholder='Costo' value={costo}
                      onChange={(e) => setCosto(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col">
                  <label htmlFor="precio">Precio</label>
                  <div className=" input-group mb-2">
                    <input type="number" className="form-control" id='precio' placeholder='Precio' value={precio}
                      onChange={(e) => { setPrecio(e.target.value), setPts(Math.trunc(e.target.value / 10)) }}
                    />
                  </div>
                </div>
                <div className="col">
                  <label htmlFor="pts">Puntos</label>
                  <div className=" input-group mb-2">
                    <input type="number" className="form-control" id='pts' placeholder='Puntos' value={pts}
                      onChange={(e) => setPts(e.target.value)}
                    />
                  </div>
                </div>

              </div>

              <div>
                <button id='btnCerrarModal' type='button' className="btn btn-secondary me-3 my-3" data-bs-dismiss='modal'>
                  <i className="fa-solid fa-xmark me-2" />Cerrar
                </button>
                <button onClick={() => eliminarProducto()} id='btnEliminarP' type='button' className="btn btn-danger me-3 my-3">
                  <i className="fa-solid fa-trash me-2" />Borrar producto
                </button>
                <button onClick={() => validarProducto()} id='btnAceptar' className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk me-2" />Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div id='modal-servicios' className="modal fade" aria-hidden='true'>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 id='lblTitleS'>{title}</h4>
              <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className="modal-body">

              <div className="input-group mb-2">
                <span className="input-group-text"><i className="fa-solid fa-boxes-stacked"></i></span>
                <input type="text" className="form-control" id='nombreS' placeholder='Nombre' value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="form-floating">
                <textarea className="form-control my-2" placeholder="Descripción" id="floatingTextarea2S" style={{ height: '120px' }}
                  value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                >
                </textarea>
                <label htmlFor="floatingTextarea2">Descripción</label>
              </div>

              <div className="row">
                <div className="col">
                  <label htmlFor="precio">Precio</label>
                  <div className=" input-group mb-2">
                    <input type="number" className="form-control" id='precioS' placeholder='Precio' value={precio}
                      onChange={(e) => { setPrecio(e.target.value), setPts(Math.trunc(e.target.value / 10)) }}
                    />
                  </div>
                </div>
                <div className="col">
                  <label htmlFor="pts">Puntos</label>
                  <div className=" input-group mb-2">
                    <input type="number" className="form-control" id='ptsS' placeholder='Puntos' value={pts}
                      onChange={(e) => setPts(e.target.value)}
                    />
                  </div>
                </div>

              </div>

              <div>
                <button id='btnCerrarModalS' type='button' className="btn btn-secondary me-3 my-3" data-bs-dismiss='modal'>
                  <i className="fa-solid fa-xmark me-2" />Cerrar
                </button>
                <button onClick={() => eliminarServicio()} id='btnEliminarS' type='button' className="btn btn-danger me-3 my-3">
                  <i className="fa-solid fa-trash me-2" />Borrar servicio
                </button>
                <button onClick={() => validarServicio()} id='btnAceptarS' className="btn btn-success">
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

export default Catalogo