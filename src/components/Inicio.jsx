import React, { useState } from 'react'
import { Navbar } from './Navbar.jsx'
import { Clientes } from './Clientes.jsx'
import Venta from './Venta.jsx'
import Catalogo from './Catalogo.jsx'
import Horario from './Horario.jsx'
import Barbers from './Barbers.jsx'
import Agenda from './Agenda.jsx'
import Caja from './Caja.jsx'

export const Inicio = ({ logout, user }) => {
    const [btnVenta, setBtnVenta] = useState(true)
    const [btnClientes, setBtnClientes] = useState(false)
    const [btnCatalogo, setBtnCatalogo] = useState(false)
    const [btnHorarios, setBtnHorarios] = useState(false)
    const [btnBarbers, setBtnBarbers] = useState(false)
    const [btnAgenda, setBtnAgenda] = useState(false)
    const [btnCaja, setBtnCaja] = useState(false)

    const funciones = {setBtnVenta:setBtnVenta, setBtnClientes:setBtnClientes, setBtnCatalogo:setBtnCatalogo, 
        setBtnHorarios:setBtnHorarios, setBtnBarbers:setBtnBarbers, setBtnAgenda:setBtnAgenda, setBtnCaja:setBtnCaja}

    const estados = {btnVenta:btnVenta, btnClientes:btnClientes, btnCatalogo:btnCatalogo, btnHorarios:btnHorarios,
        btnHorarios:btnHorarios, btnBarbers:btnBarbers, btnAgenda:btnAgenda, btnCaja:btnCaja}

    const cerrarSesion = () => {
        logout()
    }

    return (
        <>
            <Navbar logout={cerrarSesion} funciones={funciones} estados={estados} user={user}/>
            {btnVenta && <Venta user={user}/> }
            {btnClientes && <Clientes />}
            {btnCatalogo && <Catalogo/>}
            {btnHorarios && <Horario/>}
            {btnBarbers && <Barbers/>}
            {btnAgenda && <Agenda/>}
            {btnCaja && <Caja user={user}/>}
        </>
    )
}
