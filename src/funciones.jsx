import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Axios from 'axios'
import getClientes from './components/Clientes'
import { ImprimirReporte, ImprimirTicket, abrirCajon, abrirCajon2 } from './Impresiones'
import { ConectorPluginV3 } from './plugin'


const server = import.meta.env.VITE_SERVER
const municipio = import.meta.env.VITE_MUNICIPIO
// const server = 'http://localhost'

const opciones = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: 'long' }

export function showAlert(mensaje, icono, foco = '') {
  onfocus(foco);
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title: mensaje,
    icon: icono
  });
}
export function showAlertBtn(title, icono, text, foco = '', idCobro, descuento, subtotal, listaServicios = [], listaProductos = [], total, pagoEfectivo = 0, pagoTarjeta = 0, pagoPts = 0, cliente, barber, pts) {
  onfocus(foco);
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title: title,
    text: text,
    icon: icono,
    showConfirmButton: true,
    confirmButtonText: 'Reeimprimir',
    showDenyButton: true, 
    denyButtonText: 'Cerrar', 
    focusDeny: true, 
  }).then((result) => {
    if (result.isConfirmed) {
      ImprimirTicket(idCobro, descuento, subtotal, listaServicios = [], listaProductos = [], total, pagoEfectivo = 0, pagoTarjeta = 0, pagoPts = 0, cliente, barber, pts, true)
    } else {
      MySwal.close();
    }
  })
}

// function MostrarDatos(idCobro, descuento, subtotal, listaServicios = [], listaProductos = [], total, pagoEfectivo = 0, pagoTarjeta = 0, pagoPts = 0, cliente, barber, pts) {
//   console.log("idCobro: " + idCobro);
//   console.log("descuento: " + descuento)
//   console.log("subtotal: " + subtotal)
//   console.log("total: " + total)
//   console.log("pagoEfectivo: " + pagoEfectivo);
//   console.log("pagoTarjeta: " + pagoTarjeta);
//   console.log("pagoPts: " + pagoPts);
//   console.log("clientes: " + cliente)
//   console.log("barber: " + barber)
//   console.log("pts: " + pts)
//   listaProductos.forEach(producto => {
//     console.log(producto)
//   })
//   listaServicios.forEach(servicio => {
//     console.log(servicio)
//   })
// }

function onfocus(foco) {
  if (foco !== '') {
    document.getElementById(foco).focus();
  }
}

export function capitalize(cadena) {
  let capital = ""
  const palabras = cadena.split(" ")
  palabras.forEach(palabra => {
    if (palabra != "")
      capital += palabra[0].toUpperCase() + palabra.substr(1).toLowerCase() + " "
  });
  return capital.slice(0, -1)
}

export function validarFecha(fecha) {
  if (fecha == '') {
    return null
  } else {
    return fecha
  }
}

export function formatearFechaCorta(fecha) {
  const date = new Date(fecha);
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getUTCDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  let hh = date.getHours() + 1
  let min = date.getMinutes()
  let ss = date.getSeconds()
  if (hh < 10) hh = '0' + hh;
  if (min < 10) min = '0' + min;
  if (ss < 10) ss = '0' + ss;
  return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
}

export function formatearFecha(fecha) {
  const fechaFormateada = new Date(fecha)
  return fechaFormateada.toLocaleDateString('es-MX', opciones)
}

export const addCliente = (nombre, telefono, pts, genero, fechaNacimiento, codigoQR, municipio, getClientes) => {
  Axios.post(`${server}/create-cliente`, {
    nombre: capitalize(nombre),
    telefono: telefono,
    pts: pts,
    genero: genero,
    fechaNacimiento: validarFecha(fechaNacimiento),
    municipio: municipio
  }).then(() => {
    getClientes && getClientes()
  }).finally(() => showAlert("Cliente registrado con éxito", 'success'))
}

export const updateCliente = (nombre, telefono, pts, genero, fechaNacimiento, codigoQR, municipio, id, getClientes) => {
  Axios.put(`${server}/update-cliente`, {
    nombre: capitalize(nombre),
    telefono: telefono,
    pts: pts,
    genero: genero,
    fechaNacimiento: validarFecha(fechaNacimiento),
    municipio: municipio,
    id: id,
  }).then(() => {
    getClientes()
    showAlert("Datos actualizados", 'success')
  })
}

export const getEmpleado = (id, setEmpleado) => {
  Axios.get(`${server}/empleado/${id}`).then((response) => {
    setEmpleado(response.data[0])
  })
}

export const getEmpleados = (setEmpleados, setHorarios) => {
  Axios.get(`${server}/empleados`).then((response) => {
    setEmpleados(response.data)
  }).then(() => {
    Axios.get(`${server}/horarios`).then((response) => {
      setHorarios(response.data)
    })
  })
}

export const addEmpleado = (nombre, telefono, correo, usuario, pass, puesto, estatus, foto, fechaInicio, fechaNacimiento, muni, getEmpleados) => {
  Axios.post(`${server}/create-empleado`, {
    nombre: capitalize(nombre),
    telefono: telefono,
    correo: correo,
    usuario: usuario,
    fechaNacimiento: validarFecha(fechaNacimiento),
    fechaInicio: validarFecha(fechaInicio),
    pass: pass,
    puesto: puesto,
    estatus: estatus,
    foto: foto,
    municipio: muni
  }).then((res) => {
    Axios.post(`${server}/create-horario`, {
      idBarber: res.data.insertId
    })
    getEmpleados()
    showAlert("Empleado registrado con éxito", 'success')
  });
}

export const updateEmpleado = (checkCatalogo, checkHorarios, checkBarbers, checkCaja, checkClientes, nombre, telefono, correo, usuario, pass, puesto, estatus, foto, fechaInicio, fechaNacimiento, muni, id, getEmpleados) => {
  Axios.put(`${server}/update-empleado`, {
    nombre: capitalize(nombre),
    telefono: telefono,
    correo: correo,
    usuario: usuario,
    fechaNacimiento: validarFecha(fechaNacimiento),
    fechaInicio: validarFecha(fechaInicio),
    pass: pass,
    puesto: puesto,
    estatus: estatus,
    municipio: muni,
    id: id,
  }).then(() => {
    axios.delete(`${server}/delete-permisos/${id}`).then(() => {
      if (checkCatalogo) Axios.post(`${server}/create-permiso`, {
        permiso: 'catalogo',
        idEmpleado: id
      })
      if (checkHorarios) Axios.post(`${server}/create-permiso`, {
        permiso: 'horarios',
        idEmpleado: id
      })
      if (checkBarbers) Axios.post(`${server}/create-permiso`, {
        permiso: 'barbers',
        idEmpleado: id
      })
      if (checkCaja) Axios.post(`${server}/create-permiso`, {
        permiso: 'caja',
        idEmpleado: id
      })
      if (checkClientes) Axios.post(`${server}/create-permiso`, {
        permiso: 'clientes',
        idEmpleado: id
      })
    }).finally(() => {
      getEmpleados()
      showAlert("Datos actualizados", 'success')
    })
  })
}
export const updatePassword = (pass, id) => {
  Axios.put(`${server}/update-password`, {
    pass: pass,
    id: id,
  })
}

export const updateFotoEmpleado = (formdata, id) => {
  Axios.put(`${server}/update-foto-empleado`, {
    foto: formdata,
    id: id,
  }).then(() => {
    showAlert("Foto actualizada", 'success')
  });
}

export const addCobro = (nombreCliente, nombreBarber, ptsCliente, descuento, subtotal, divider, getClientes, idCliente, total, ptsAcumulados, metodoPago, idBarber, idCobrador, pagoEfectivo, pagoTarjeta = 0, pagoPuntos = 0, listaProductos, listaServicios) => {
  Axios.post(`${server}/create-cobro`, {
    idCliente: idCliente,
    total: total,
    descuento: descuento,
    subtotal: subtotal,
    totalPuntos: ptsAcumulados,
    metodoPago: metodoPago,
    idBarber: divider ? 7 : idBarber,
    idCobrador: idCobrador,
    pagoEfectivo: pagoEfectivo,
    pagoTarjeta: pagoTarjeta,
    pagoPuntos: pagoPuntos,
    municipio: municipio
  }).then((res) => {
    ImprimirTicket(res.data.insertId, descuento, subtotal, listaServicios, listaProductos, total, pagoEfectivo, pagoTarjeta, pagoPuntos, nombreCliente, nombreBarber, Math.trunc(+ptsCliente + +ptsAcumulados))
    idCliente != '122'
      ? showAlertBtn("Venta registrada", 'success', "¿Desea reeimprimir el Ticket?", undefined, res.data.insertId, descuento, subtotal, listaServicios, listaProductos, total, pagoEfectivo, pagoTarjeta, pagoPuntos, nombreCliente, nombreBarber, Math.trunc(+ptsCliente + +ptsAcumulados))
      : showAlertBtn("Venta de prueba", 'info', "¿Desea reeimprimir el Ticket?", undefined, res.data.insertId, descuento, subtotal, listaServicios, listaProductos, total, pagoEfectivo, pagoTarjeta, pagoPuntos, nombreCliente, nombreBarber, Math.trunc(+ptsCliente + +ptsAcumulados))
    listaServicios.forEach(servicio => {
      Axios.post(`${server}/create-detalle-servicio`, {
        idCobro: res.data.insertId,
        idServicio: servicio.id,
        cantidad: servicio.cantidad,
        precioActual: servicio.precio,
        puntosActual: servicio.pts,
        idBarber: divider ? servicio.idBarber : idBarber
      })
    });
    listaProductos.forEach(producto => {
      Axios.post(`${server}/create-detalle-producto`, {
        idCobro: res.data.insertId,
        idProducto: producto.id,
        cantidad: producto.cantidad,
        precioActual: producto.precio,
        puntosActual: producto.pts,
        idBarber: divider ? producto.idBarber : idBarber
      })
      Axios.put(`${server}/update-inventario`, {
        cantidad: - producto.cantidad,
        id: producto.id,
      })
    })
    Axios.put(`${server}/update-cliente-pts`, {
      pts: ptsAcumulados,
      id: idCliente,
    })
    if (idCliente != '122') {
      Axios.put(`${server}/update-caja`, {
        efectivo: pagoEfectivo,
        dineroElectronico: pagoTarjeta,
        puntos: pagoPuntos,
        id: municipio
      })
    }
  }).finally(() => {
    getClientes()
  })
}


export const addDetalleServicio = (idCobro, idServicio, cantidad, precioActual, puntosActual) => {
  Axios.post(`${server}/create-detalle-servicio`, {
    idCobro: idCobro,
    idServicio: idServicio,
    cantidad: cantidad,
    precioActual: precioActual,
    puntosActual: puntosActual
  })
}

export const addDetalleProducto = (idCobro, idProducto, cantidad, precioActual, puntosActual) => {
  Axios.post(`${server}/create-detalle-producto`, {
    idCobro: idCobro,
    idProducto: idProducto,
    cantidad: cantidad,
    precioActual: precioActual,
    puntosActual: puntosActual
  })
}

export const getActividadSemana = (id, setServiciosSemana, setProductosSemana, setServicios, setProductos, calcularTotal) => {
  let lista1 = [], lista2 = []
  setServicios([])
  setProductos([])
  Axios.get(`${server}/servicios-semana/${id}`).then((res) => {
    setServiciosSemana(res.data)
    lista1 = res.data
  }).then(() => {
    Axios.get(`${server}/productos-semana/${id}`).then((res) => {
      setProductosSemana(res.data)
      lista2 = res.data
    })
  }).finally(() => {
    calcularTotal(lista1, lista2)
  })
}
export const getActividadCompleta = (id, getServicios, getProductos) => {
  let lista1 = [], lista2 = []
  Axios.get(`${server}/servicios-semana-all/${id}`).then((res) => {
    getServicios(res.data)
    lista1 = res.data
  }).then(() => {
    Axios.get(`${server}/productos-semana-all/${id}`).then((res) => {
      getProductos(res.data)
      lista2 = res.data
    })
  })
}

export const getCliente = (id) => {
  const instruccion = server + '/cliente/' + id
    (instruccion)
}
export const getProducto = (id) => {
  const instruccion = server + '/producto/' + id
  axios.get(instruccion)
}
export const getServicio = (id) => {
  const instruccion = server + '/servicio/' + id
  axios.get(instruccion)
}
export const addProducto = (nombre, marca, linea, contenido, enVenta, suministros, almacen, descripcion, costo, precio, pts, municipio, getProductos) => {
  Axios.post(`${server}/create-producto`, {
    nombre: capitalize(nombre),
    marca: marca,
    linea: linea,
    contenido: contenido,
    enVenta: enVenta,
    suministros: suministros,
    almacen: almacen,
    descripcion: descripcion,
    costo: costo,
    precio: precio,
    pts: pts,
    municipio: municipio
  }).then(() => {
    getProductos()
    showAlert("Producto registrado con éxito", 'success')
  });
}

export const updateProducto = (nombre, marca, linea, contenido, enVenta, suministros, almacen, descripcion, costo, precio, pts, id, getProductos) => {
  Axios.put(`${server}/update-producto`, {
    nombre: capitalize(nombre),
    marca: marca,
    linea: linea,
    contenido: contenido,
    enVenta: enVenta,
    suministros: suministros,
    almacen: almacen,
    descripcion: descripcion,
    costo: costo,
    precio: precio,
    pts: pts,
    id: id,
  }).then(() => {
    getProductos()
    showAlert("Datos actualizados", 'success')
  });
}

export const addServicio = (nombre, descripcion, precio, pts, municipio, getServicios) => {
  Axios.post(`${server}/create-servicio`, {
    nombre: capitalize(nombre),
    descripcion: descripcion,
    precio: precio,
    pts: pts,
    municipio: municipio
  }).then(() => {
    getServicios()
    showAlert("Servicio registrado con éxito", 'success')
  });
}


export const updateServicio = (nombre, descripcion, precio, pts, id, getServicios) => {
  Axios.put(`${server}/update-servicio`, {
    nombre: capitalize(nombre),
    descripcion: descripcion,
    precio: precio,
    pts: pts,
    id: id
  }).then(() => {
    getServicios()
    showAlert("Datos actualizados", 'success')
  });
}

export const addReporte = (total, nombreBarber, movimientos, idBarber, montoEfectivo, montoElectronico, montoPts) => {
  Swal.fire({
    title: "¿Seguro de hacer el reporte del día?",
    icon: "question", text: "Solo se puede hace una vez al día",
    showCancelButton: true, confirmButtonText: "Realizar reporte", cancelButtonText: "Cancelar", confirmButtonColor: "red"
  }).then((result) => {
    if (result.isConfirmed) {
      Axios.post(`${server}/create-reporte`, {
        idBarber: idBarber,
        montoEfectivo: montoEfectivo,
        montoElectronico: montoElectronico,
        montoPts: montoPts,
        municipio: municipio
      }).then(() => {
        Axios.put(`${server}/update-caja`, {
          id: municipio,
          efectivo: - montoEfectivo,
          dineroElectronico: - montoElectronico,
          puntos: - montoPts
        })
      }).then(() => {
        let totalRetiros = 0
        let totalIngresos = 0
        let retiros = []
        let ingresos = []
        movimientos.forEach(movimiento => {
          if (movimiento.cantidad > 0) {
            totalIngresos += movimiento.cantidad
            ingresos.push(movimiento)
          } else {
            totalRetiros += movimiento.cantidad
            retiros.push(movimiento)
          }
        });
        ImprimirReporte(total, montoEfectivo, montoElectronico, montoPts, nombreBarber, retiros, ingresos, totalRetiros, totalIngresos)
      })
        .finally(() => showAlert("Reporte registrado", 'success'))
    } else {
      showAlert("Cancelado", "info")
    }
  })
}

export const getDetallesServ = (idCobro, setDetalles) => {
  const instruccion = server + '/detalles-servicio/' + idCobro
  axios.get(instruccion).then((response) => {
    setDetalles(response.data)
    console.log(server + '/detalles-servicio/' + idCobro)
  })
}

export const getDetallesPro = (idCobro, setDetalles) => {
  const instruccion = server + '/detalles-producto/' + idCobro
  axios.get(instruccion).then((response) => {
    setDetalles(response.data)
  })
}

export const addMovimiento = (concepto, cantidad, idBarber, caja, cajon) => {
  Axios.post(`${server}/create-movimiento`, {
    concepto: concepto,
    cantidad: cantidad,
    idUsuario: idBarber,
    municipio: municipio
  }).then(() => {
    Axios.put(`${server}/update-caja`, {
      efectivo: cantidad,
      dineroElectronico: 0,
      puntos: 0,
      id: municipio
    })
  }).finally(() => {
    if (caja) window.location.reload()
    if(cajon == 1){
      abrirCajon()
    }else{
      abrirCajon2()
    }
    showAlert("Movimiento registrado con éxito", 'success')
  })
}

export const crearHorario = (id) => {
  Axios.post(`${server}/create-horario`, {
    idBarber: id
  })
}
export const guardarHorario = (obtenerEmpleados, lunIn, lunOut, marIn, marOut, mieIn, mieOut, jueIn, jueOut, vieIn, vieOut, sabIn, sabOut, domIn, domOut, idBarber) => {
  Axios.put(`${server}/update-horario`, {
    idBarber: idBarber,
    lunIn: lunIn,
    lunOut: lunOut,
    marIn: marIn,
    marOut: marOut,
    mieIn: mieIn,
    mieOut: mieOut,
    jueIn: jueIn,
    jueOut: jueOut,
    vieIn: vieIn,
    vieOut: vieOut,
    sabIn: sabIn,
    sabOut: sabOut,
    domIn: domIn,
    domOut: domOut
  }).then(() => {
    obtenerEmpleados()
    showAlert("Horario actualizado", 'success')
  })
}

export const getChequeos = (setChequeos) => {
  Axios.get(`${server}/chequeos`).then((response) => {
    setChequeos(response.data)
  })
}
export const getChequeosHoy = (setChequeosHoy) => {
  Axios.get(`${server}/chequeos-hoy`).then((response) => {
    setChequeosHoy(response.data)
  })
}

export const iniciarDescanso = (id, getDescanso) => {
  Axios.put(`${server}/iniciar-descanso`, {
    idBarber: id
  }).then((res) => {
    showAlert("Descanso iniciado:\n" + (new Date).toLocaleTimeString('es-mx', { hour12: true }), 'success')
    getDescanso()
  })
}
export const finalizarDescanso = (id, getDescanso) => {
  Axios.put(`${server}/finalizar-descanso`, {
    idBarber: id
  }).then((res) => {
    showAlert("Descanso finalizado:\n" + (new Date).toLocaleTimeString('es-mx', { hour12: true }), 'success')
    getDescanso()
  })
}
export const registrarSalida = (id, logout) => {
  Axios.put(`${server}/registrar-salida`, {
    idBarber: id
  }).then((res) => {
    showAlert("Salida:\n" + (new Date).toLocaleTimeString('es-mx', { hour12: true }), 'success')
    logout()
  })
}