import './App.css'
import './style.css'
import { Navbar } from './components/Navbar.jsx'
import { LoginTKB } from './components/LoginTKB.jsx'
import Clientes from './components/Clientes'
import React, { useState } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import RutasProtegidas from './components/RutasProtegidas'
import { Inicio } from './components/Inicio.jsx'
import { showAlert } from './funciones'
import { useLocalStorage } from './useLocalStorage'

function App() {
  // const server = 'http://localhost'
  const server = import.meta.env.VITE_SERVER
  const municipio = import.meta.env.VITE_MUNICIPIO

  const [user, setUser] = useLocalStorage('user', null)

  const login = (usuario, pass) => {
    usuario = usuario.trim()
    const instruccion = server + '/auth/' + usuario + '/' + pass
    axios.get(instruccion).then((response) => {
      if (response.data[0]) {
        setUser(response.data[0])
        axios.put(`${server}/cambio-municipio`, {
          id: response.data[0].id,
          municipio: municipio
        })
        axios.get(`${server}/chequeo/${response.data[0].id}`).then((resGet) => {
          if (!resGet.data[0]) {
            axios.post(`${server}/create-chequeos`, {
              idBarber: response.data[0].id,
              municipio: municipio
            }).then((resCreate) => {
              showAlert('Hora de llegada:\n' + (new Date).toLocaleTimeString('es-mx', { hour12: true }), 'success')
            })
          }
        })
      } else {
        showAlert("Credenciales incorrectas", "error")
      }
    })
  }

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  // window.addEventListener("beforeunload", function (e) {
  //   logout()
  // });

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={
          !!user ? <Navigate to={'/'} /> : <LoginTKB login={login} />}></Route>
        <Route element={<RutasProtegidas isAllowed={!!user} />}>
          <Route path='/' element={<Inicio logout={logout} user={user} />} />
          <Route path='/prueba' element={<Clientes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
