import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const RutasProtegidas = ({ isAllowed, children, goTo = '/login' }) => {
    if (!isAllowed) {
        console.log(isAllowed)
        return <Navigate to={goTo} />
    }
    return children ? children : <Outlet />

}

export default RutasProtegidas