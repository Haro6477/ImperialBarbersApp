import React, { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar.jsx'
import { Clientes } from './Clientes.jsx'
import Venta from './Venta.jsx'
import Catalogo from './Catalogo.jsx'
import Horarios from './Horarios.jsx'
import Barbers from './Barbers.jsx'
import Agenda from '../components/Agenda.jsx'
import Caja from './Caja.jsx'
import { Perfil } from './Perfil.jsx'
import { useLocalStorage } from '../useLocalStorage.jsx'

export const Inicio = ({ logout, user, clientes, setClientes, empleados, setEmpleados, horarios, setHorarios, listFotos, setListFotos, productos, setProductos, servicios, setServicios, cobros, setCobros, movimientosHoy, setMovimientosHoy, reporte, setReporte }) => {
    const server = import.meta.env.VITE_SERVER
    const municipio = import.meta.env.VITE_MUNICIPIO

    const [btnVenta, setBtnVenta] = useState(true)
    const [btnClientes, setBtnClientes] = useState(false)
    const [btnCatalogo, setBtnCatalogo] = useState(false)
    const [btnHorarios, setBtnHorarios] = useState(false)
    const [btnBarbers, setBtnBarbers] = useState(false)
    const [btnAgenda, setBtnAgenda] = useState(false)
    const [btnCaja, setBtnCaja] = useState(false)
    const [btnPerfil, setBtnPerfil] = useState(false)

    const [caja, setCaja] = useLocalStorage('caja', null)

    useEffect(() => {
        if (!caja) getCaja()
    }, [])

    const funciones = {
        setBtnVenta: setBtnVenta, setBtnClientes: setBtnClientes, setBtnCatalogo: setBtnCatalogo, setBtnHorarios: setBtnHorarios,
        setBtnBarbers: setBtnBarbers, setBtnAgenda: setBtnAgenda, setBtnCaja: setBtnCaja, setBtnPerfil: setBtnPerfil
    }

    const estados = {
        btnVenta: btnVenta, btnClientes: btnClientes, btnCatalogo: btnCatalogo,
        btnHorarios: btnHorarios, btnBarbers: btnBarbers, btnAgenda: btnAgenda, btnCaja: btnCaja, btnPerfil: btnPerfil
    }

    const cerrarSesion = () => {
        logout()
    }

    const getCaja = () => {
        axios.get(`${server}/caja/${municipio}`).then((response) => {
            const cajaAux = {
                efectivo: response.data[0].efectivo,
                dineroElectronico: response.data[0].dineroElectronico,
                puntos: response.data[0].puntos
            }
            setCaja(cajaAux)
        })
    }

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar logout={cerrarSesion} funciones={funciones} estados={estados} user={user} clientes={clientes} setClientes={setClientes} movimientos={movimientosHoy} setMovimientos={setMovimientosHoy} getCaja={getCaja} />
            {btnVenta && <Venta user={user} clientes={clientes} setClientes={setClientes} empleados={empleados} productos={productos} servicios={servicios} getCaja={getCaja} setProductos={setProductos} />}
            {btnClientes && <Clientes user={user} clientes={clientes} setClientes={setClientes} />}
            {btnCatalogo && <Catalogo user={user} productos={productos} setProductos={setProductos} servicios={servicios} setServicios={setServicios} />}
            {btnHorarios && <Horarios user={user} empleados={empleados} horarios={horarios} setHorarios={setHorarios} />}
            {btnBarbers && <Barbers user={user} empleados={empleados} setEmpleados={setEmpleados} listFotos={listFotos} setListFotos={setListFotos} />}
            {btnAgenda && <Agenda />}
            {btnCaja && <Caja user={user} cobros={cobros} setCobros={setCobros} movimientos={movimientosHoy} reporte={reporte} setReporte={setReporte} caja={caja} getCaja={getCaja} />}
            {btnPerfil && <Perfil user={user} />}
        </div>
    )
}