import React, { useState } from 'react'
import { Navbar } from './Navbar.jsx'
import { Clientes } from './Clientes.jsx'
import Venta from './Venta.jsx'
import Catalogo from './Catalogo.jsx'
import Horarios from './Horarios.jsx'
import Barbers from './Barbers.jsx'
import Agenda from './Agenda.jsx'
import Caja from './Caja.jsx'
import { Perfil } from './Perfil.jsx'

export const Inicio = ({ logout, user }) => {
    const [btnVenta, setBtnVenta] = useState(true)
    const [btnClientes, setBtnClientes] = useState(false)
    const [btnCatalogo, setBtnCatalogo] = useState(false)
    const [btnHorarios, setBtnHorarios] = useState(false)
    const [btnBarbers, setBtnBarbers] = useState(false)
    const [btnAgenda, setBtnAgenda] = useState(false)
    const [btnCaja, setBtnCaja] = useState(false)
    const [btnPerfil, setBtnPerfil] = useState(false)

    const funciones = {setBtnVenta:setBtnVenta, setBtnClientes:setBtnClientes, setBtnCatalogo:setBtnCatalogo, setBtnHorarios:setBtnHorarios,
        setBtnBarbers:setBtnBarbers, setBtnAgenda:setBtnAgenda, setBtnCaja:setBtnCaja, setBtnPerfil:setBtnPerfil}

    const estados = {btnVenta:btnVenta, btnClientes:btnClientes, btnCatalogo:btnCatalogo,
        btnHorarios:btnHorarios, btnBarbers:btnBarbers, btnAgenda:btnAgenda, btnCaja:btnCaja, btnPerfil:btnPerfil}

    const cerrarSesion = () => {
        logout()
    }

    return (
        <div style={{minHeight: '100vh'}}>
            <Navbar logout={cerrarSesion} funciones={funciones} estados={estados} user={user}/>
            {btnVenta && <Venta user={user}/> }
            {btnClientes && <Clientes />}
            {btnCatalogo && <Catalogo/>}
            {btnHorarios && <Horarios/>}
            {btnBarbers && <Barbers/>}
            {btnAgenda && <Agenda/>}
            {btnCaja && <Caja user={user}/>}
            {btnPerfil && <Perfil user={user}/>}
        </div>
    )
}