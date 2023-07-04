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
  const [user, setUser] = useLocalStorage('user', null)

  const login = (usuario, pass) => {
    let empleado = {}
    const instruccion = server + '/auth/' + usuario + '/' + pass
    axios.get(instruccion).then((response) => {
      if (response.data[0]) {
        empleado = response.data[0]
        const cadena = server + '/permisos-usuario/' + empleado.id
        axios.get(cadena).then((res2) => {
          let permisos = []
          res2.data.forEach(item => {
            permisos.push(item.permiso)
          });
          empleado.permisos = permisos
        }).then(() => {
          setUser(empleado)
        }).catch((error) => console.log(error))

      } else {
        showAlert("Credenciales incorrectas", "error")
      }
    })
  }

  const logout = () => setUser(null)

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

{/* <FormularioCliente/> */ }
{/* {
        !user.length > 0
          ? <LoginTKB setUser={setUser}></LoginTKB>
          : <FormularioCliente/>
      } */}

export default App
