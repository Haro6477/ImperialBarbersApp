import './App.css'
import './style.css'
import { LoginTKB } from './pages/LoginTKB.jsx'
import React, { useEffect } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import RutasProtegidas from './components/RutasProtegidas'
import { Inicio } from './pages/Inicio.jsx'
import { showAlert } from './funciones'
import { useLocalStorage } from './useLocalStorage'

function App() {
  // const server = 'http://localhost'
  const server = import.meta.env.VITE_SERVER
  const municipio = import.meta.env.VITE_MUNICIPIO

  const [user, setUser] = useLocalStorage('user', null)
  const [clientes, setClientes] = useLocalStorage('clientes', [])
  const [empleados, setEmpleados] = useLocalStorage('empleados', [])
  const [horarios, setHorarios] = useLocalStorage('horarios', [])
  const [productos, setProductos] = useLocalStorage('productos', [])
  const [servicios, setServicios] = useLocalStorage('servicios', [])
  const [cobros, setCobros] = useLocalStorage('cobros', [])
  const [reporte, setReporte] = useLocalStorage('reporte', null)
  const [movimientosHoy, setMovimientosHoy] = useLocalStorage('movimientos', [])
  const [listFotos, setListFotos] = useLocalStorage('listFotos', [])

  useEffect(() => {
    getClientes()
    getEmpleados()
    getHorarios()
    getFotos()
    getProductos()
    getServicios()
    getCobros()
    getMovimientosHoy()
    getReporte()
  }, [])

  const getClientes = () => {
    console.log("Cargando todos los clientes...")
    axios.get(`${server}/clientes`).then((response) => {
      setClientes(response.data);
    }).then(() => { console.log("Clientes listos") })
  }

  const getEmpleados = () => {
    console.log("Cargando empleados...")
    let emp = []
    let permisos = []
    axios.get(`${server}/empleados`).then((response) => {
      emp = response.data
    }).then(() => {
      axios.get(`${server}/permisos`).then((res2) => {
        permisos = res2.data
      }).then(() => {
        emp.forEach(empleado => {
          empleado.permisos = []
          permisos.forEach(permiso => {
            if (empleado.id === permiso.idEmpleado) {
              empleado.permisos.push(permiso.permiso)
            }
          });
        });
      }).then(() => {
        setEmpleados(emp)
        console.log("Empleados listos")
      })
    })
  }

  const getFotos = () => {
    fetch(`${server}/fotos-empleados`)
      .then(res => res.json())
      .then(res => setListFotos(res))
      .catch(err => {
        alert.error(err)
      })
  }

  const getHorarios = () => {
    console.log("Cargando horarios...")
    axios.get(`${server}/horarios`).then((response) => {
      setHorarios(response.data);
    }).then(() => { console.log("Horarios listos") })
  }

  const getProductos = () => {
    console.log("Cargando productos...")
    axios.get(`${server}/productos/${municipio}`).then((response) => {
      setProductos(response.data);
    }).then(() => { console.log("Productos listos") })
  }

  const getServicios = () => {
    console.log("Cargando servicios...")
    axios.get(`${server}/servicios/${municipio}`).then((response) => {
      setServicios(response.data);
    }).then(() => { console.log("Servicios listros") })
  }

  const getCobros = () => {
    console.log("Cargando cobros...")
    axios.get(`${server}/cobros/${municipio}`).then((response) => {
      setCobros(response.data)
    }).then(() => { console.log("Cobros listos") })
  }

  const getReporte = () => {
    console.log("Consultando reporte de hoy...")
    axios.get(`${server}/reporte-hoy/${municipio}`).then((response) => {
      if (response.data) {
        setReporte(true)
      } else {
        setReporte(false)
      }
    }).then(() => { console.log("Reporte listo") })
  }

  const getMovimientosHoy = () => {
    axios.get(`${server}/movimientos-hoy/${municipio}`).then((response) => {
      setMovimientosHoy(response.data)
    })
  }

  const login = (usuario, pass) => {
    usuario = usuario.trim()
    const instruccion = server + '/auth/' + usuario + '/' + pass
    axios.get(instruccion).then((response) => {
      if (response.data[0]) {
        axios.get(`${server}/permisos-usuario/${response.data[0].id}`).then((res) => {
          let perms = []
          res.data.forEach(item => {
            perms.push(item.permiso)
          });
          let usuarioAux = response.data[0]
          usuarioAux.permisos = perms
          setUser(usuarioAux)
        })
        axios.put(`${server}/cambio-municipio`, {
          id: response.data[0].id,
          municipio: municipio
        }).then(() => {
          let indiceEmpleado = empleados.findIndex((emp) => emp.id == response.data[0].id)
          if (indiceEmpleado !== -1) {
            const nuevosEmpleados = [...empleados];
            nuevosEmpleados[indiceEmpleado].municipio = municipio;
            setEmpleados(nuevosEmpleados);
          }
        })
        axios.get(`${server}/chequeo/${response.data[0].id}`).then((resGet) => {
          if (!resGet.data[0]) {
            axios.post(`${server}/create-chequeos`, {
              idBarber: response.data[0].id,
              municipio: municipio
            }).then(() => {
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
          <Route path='/'
            element={<Inicio
              logout={logout} user={user} setUser={setUser}
              clientes={clientes} setClientes={setClientes}
              empleados={empleados} setEmpleados={setEmpleados}
              horarios={horarios} setHorarios={setHorarios}
              listFotos={listFotos} setListFotos={setListFotos}
              productos={productos} setProductos={setProductos}
              servicios={servicios} setServicios={setServicios}
              cobros={cobros} setCobros={setCobros}
              movimientosHoy={movimientosHoy} setMovimientosHoy={setMovimientosHoy}
              reporte={reporte} setReporte={setReporte} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
