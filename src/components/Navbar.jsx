import { ButtonOutline } from "./ButtonOutline"
import { ButtonPlus } from "./ButtonPlus"
import React, { useState, useEffect } from 'react'
import './navbar.css'
import { useNavigate } from "react-router-dom"
import { ButtonPill } from "./ButtonPill"
import { ButtonPlusActive } from "./ButtonPlusActive"

export const Navbar = ({ logout, funciones, estados, user }) => {
    const go = useNavigate();

    const setBtn = ((btnActive) =>{
        for(let item in funciones){
            funciones[item](false)
        }
        btnActive(true)
    })

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-navbar">
            <div className="container-fluid py-3 ">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="row collapse navbar-collapse " id="navbarSupportedContent">

                   
                    <div className="col-sm-11 col-md-10">
                        <ul className="navbar-nav d-flex justify-content-evenly">
                            <li onClick={() => {setBtn(funciones.setBtnVenta)}} className="nav-item">
                                {estados.btnVenta 
                                ? <ButtonPill icon="fa-solid fa-credit-card">Realizar Venta </ButtonPill>
                                : <ButtonOutline icon="fa-solid fa-credit-card">Realizar Venta</ButtonOutline>}
                            </li>
                            <li onClick={() => {setBtn(funciones.setBtnClientes)}} className="nav-item">
                                {estados.btnClientes
                                ? <ButtonPlusActive icon="fa-solid fa-address-book">Clientes</ButtonPlusActive>
                                : <ButtonPlus icon="fa-solid fa-address-book">Clientes</ButtonPlus>}
                                
                            </li>
                            <li onClick={() => {setBtn(funciones.setBtnCatalogo)}} className="nav-item">
                                {estados.btnCatalogo 
                                ? <ButtonPill icon="fa-solid fa-book-open">Catálogo </ButtonPill>
                                : <ButtonOutline icon="fa-solid fa-book-open">Catálogo</ButtonOutline>}
                            </li>
                            <li onClick={() => {setBtn(funciones.setBtnHorarios)}} className="nav-item">
                                {estados.btnHorarios 
                                ? <ButtonPill icon="fa-solid fa-clock">Horarios </ButtonPill>
                                : <ButtonOutline icon="fa-solid fa-clock">Horarios</ButtonOutline>}
                            </li>
                            <li onClick={() => {setBtn(funciones.setBtnBarbers)}} className="nav-item">
                                {estados.btnBarbers 
                                ? <ButtonPill icon="fa-solid fa-scissors">Barbers </ButtonPill>
                                : <ButtonOutline icon="fa-solid fa-scissors">Barbers</ButtonOutline>}
                            </li>
                            <li onClick={() => {setBtn(funciones.setBtnAgenda)}} className="nav-item">
                                {estados.btnAgenda 
                                ? <ButtonPill icon="fa-solid fa-calendar">Agenda </ButtonPill>
                                : <ButtonOutline icon="fa-solid fa-calendar">Agenda</ButtonOutline>}
                            </li>

                            <li onClick={() => {setBtn(funciones.setBtnCaja)}} className="nav-item">
                                {estados.btnCaja 
                                ? <ButtonPill icon="fa-solid fa-cash-register">Caja </ButtonPill>
                                : <ButtonOutline icon="fa-solid fa-cash-register">Caja</ButtonOutline>}
                            </li>
                        </ul>
                    </div>
                    <div className="col-sm-10 col-md-2 d-flex justify-content-end pe-5">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item  dropdown">
                                <div className="nav-link dropdown-toggle cont-img" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img className="crop" src="https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" />
                                </div>
                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark-aqui" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" >{user.nombre}</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button onClick={() => {logout()}} className="dropdown-item" >Salir</button></li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    {/* <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form> */}
                </div>
            </div>
        </nav>
    )
}