import React from 'react'

export const ButtonPlusActive = ({ children = "No", icon, openModal, setBtn, setBtnClientes }) => {
    return (
        <div className="btn-group" role="group">
            <button onClick={() => setBtn(setBtnClientes)} className="btn btn-info mb-2" type="button">
                {icon && <i className={icon + " me-2"}></i>}
                {children}
            </button>
            <button className="btn btn-outline-info mb-2" data-bs-toggle='modal' data-bs-target='#crearCliente'
                onClick={() => openModal()}>
                <i className="fa-solid fa-plus"></i>
            </button>
        </div>
    )
}