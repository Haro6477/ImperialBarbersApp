import React from 'react'

export const ButtonPlusActive = ({ children = "No", icon }) => {
    return (
        <div className="btn-group" role="group">
            <button className="btn btn-info mb-2" type="button">
                {icon && <i className={icon + " me-2"}></i>}
                {children}
            </button>
            <button className="btn btn-outline-info mb-2" >
                <i className="fa-solid fa-plus"></i>
            </button>
        </div>
    )
}