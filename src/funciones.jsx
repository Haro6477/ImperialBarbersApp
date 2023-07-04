import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Axios from 'axios'
import getClientes from './components/Clientes'
import { ImprimirReporte, ImprimirTicket } from './Impresiones'

const server = import.meta.env.VITE_SERVER
// const server = 'http://localhost'

export function showAlert(mensaje, icono, foco = '') {
    onfocus(foco);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: mensaje,
        icon: icono
    });
}

function onfocus(foco) {
    if (foco !== '') {
        document.getElementById(foco).focus();
    }
}

function capitalize(cadena) {
    let capital = ""
    const palabras = cadena.split(" ")
    palabras.forEach(palabra => {
        if (palabra != "")
            capital += palabra[0].toUpperCase() + palabra.substr(1).toLowerCase() + " "
    });
    return capital.slice(0, -1)
}

function validarFecha(fecha) {
    if (fecha == '') {
        return null
    } else {
        return fecha
    }
}

export const addCliente = (nombre, telefono, pts, genero, fechaNacimiento, codigoQR) => {
    Axios.post(`${server}/create-cliente`, {
        nombre: capitalize(nombre),
        telefono: telefono,
        pts: pts,
        genero: genero,
        fechaNacimiento: validarFecha(fechaNacimiento),
    }).then(() => {
        showAlert("Cliente registrado con éxito", 'success')
    });
}

export const updateCliente = (nombre, telefono, pts, genero, fechaNacimiento, codigoQR, id) => {
    Axios.put(`${server}/update-cliente`, {
        nombre: capitalize(nombre),
        telefono: telefono,
        pts: pts,
        genero: genero,
        fechaNacimiento: validarFecha(fechaNacimiento),
        id: id,
    }).then(() => {
        showAlert("Datos actualizados", 'success')
    });
}

export const addEmpleado = (nombre, telefono, correo, usuario, pass, puesto, estatus, foto, fechaInicio, fechaNacimiento) => {
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
        foto: foto
    }).then(() => {
        showAlert("Empleado registrado con éxito", 'success')
    });
}

export const updateEmpleado = (nombre, telefono, correo, usuario, pass, puesto, estatus, foto, fechaInicio, fechaNacimiento, id) => {
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
        id: id,
    }).then(() => {
        showAlert("Datos actualizados", 'success')
    });
}

export const updateFotoEmpleado = (foto, id) => {
    Axios.put(`${server}/update-empleado`, {
        foto: foto,
        id: id,
    }).then(() => {
        showAlert("Foto actualizada", 'success')
    });
}

export const addCobro = (idCliente, total, ptsAcumulados, metodoPago, idBarber, idCobrador, pagoEfectivo = 0, pagoTarjeta = 0, pagoPuntos = 0, listaProductos, listaServicios) => {
    Axios.post(`${server}/create-cobro`, {
        idCliente: idCliente,
        total: total,
        totalPuntos: ptsAcumulados,
        metodoPago: metodoPago,
        idBarber: idBarber,
        idCobrador: idCobrador,
        pagoEfectivo: pagoEfectivo,
        pagoTarjeta: pagoTarjeta,
        pagoPuntos: pagoPuntos,
    }).then((res) => {
        listaServicios.forEach(servicio => {
            Axios.post(`${server}/create-detalle-servicio`, {
                idCobro: res.data.insertId,
                idServicio: servicio.id,
                cantidad: servicio.cantidad,
                precioActual: servicio.precio,
                puntosActual: servicio.pts
            })
        });
        listaProductos.forEach(producto => {
            Axios.post(`${server}/create-detalle-producto`, {
                idCobro: res.data.insertId,
                idProducto: producto.id,
                cantidad: producto.cantidad,
                precioActual: producto.precio,
                puntosActual: producto.pts
            })
        });
        Axios.put(`${server}/update-cliente-pts`, {
            pts: ptsAcumulados - pagoPuntos,
            id: idCliente,
        })
        Axios.put(`${server}/update-caja`, {
            efectivo: pagoEfectivo,
            dineroElectronico: pagoTarjeta,
            puntos: pagoPuntos
        })

    }).finally(() => showAlert("Venta registrada", 'success'))

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

export const getCliente = (id) => {
    const instruccion = server + '/cliente/' + id
    axios.get(instruccion)
}
export const getProducto = (id) => {
    const instruccion = server + '/producto/' + id
    axios.get(instruccion)
}
export const getServicio = (id) => {
    const instruccion = server + '/servicio/' + id
    axios.get(instruccion)
}

export const addProducto = (nombre, marca, linea, contenido, stock, enVenta, suministros, totalExistencias, descripcion, costo, precio, pts, imagen) => {
    Axios.post(`${server}/create-producto`, {
        nombre: capitalize(nombre),
        marca: marca,
        linea: linea,
        contenido: contenido,
        stock: stock, enVenta,
        suministros: suministros,
        totalExistencias: totalExistencias,
        descripcion: descripcion,
        costo: costo,
        precio: precio,
        pts: pts,
        imagen: imagen
    }).then(() => {
        showAlert("Producto registrado con éxito", 'success')
    });
}

export const updateProducto = (nombre, marca, linea, contenido, stock, enVenta, suministros, totalExistencias, descripcion, costo, precio, pts, imagen, id) => {
    Axios.put(`${server}/update-producto`, {
        nombre: capitalize(nombre),
        marca: marca,
        linea: linea,
        contenido: contenido,
        stock: stock, enVenta,
        suministros: suministros,
        totalExistencias: totalExistencias,
        descripcion: descripcion,
        costo: costo,
        precio: precio,
        pts: pts,
        imagen: imagen,
        id: id,
    }).then(() => {
        showAlert("Datos actualizados", 'success')
    });
}

export const addServicio = (nombre, descripcion, precio, pts) => {
    Axios.post(`${server}/create-servicio`, {
        nombre: capitalize(nombre),
        descripcion: descripcion,
        precio: precio,
        pts: pts,
    }).then(() => {
        showAlert("Servicio registrado con éxito", 'success')
    });
}


export const updateServicio = (nombre, descripcion, precio, pts, id) => {
    Axios.put(`${server}/update-servicio`, {
        nombre: capitalize(nombre),
        descripcion: descripcion,
        precio: precio,
        pts: pts,
        id: id
    }).then(() => {
        showAlert("Datos actualizados", 'success')
    });
}

export const addReporte = (total, nombreBarber, retiros, ingresos, idBarber, montoEfectivo, montoElectronico, montoPts) => {
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
            }).then(() => {
                Axios.put(`${server}/update-caja`, {
                    efectivo: - montoEfectivo,
                    dineroElectronico: - montoElectronico,
                    puntos: - montoPts
                })
            }).then(() => {
                let totalRetiros = 0
                let totalIngresos = 0
                ingresos.forEach(ingreso => {
                    totalIngresos += ingreso.cantidad
                });
                retiros.forEach(retiro => {
                    totalRetiros += retiro.cantidad
                });
                ImprimirReporte(total, montoEfectivo, montoElectronico, montoPts, nombreBarber, retiros, ingresos, totalRetiros, totalIngresos)
            })
                .finally(() => showAlert("Reporte registrado", 'success'))
        } else {
            showAlert("Cancelado", "info")
        }
    })


}

const getCobros = () => {
    axios.get(`${server}/cobros`).then((response) => {

    }).finally(() => setLoading(false))
}