import React from 'react'
import './navbar.css'

export const ButtonPlus = ({ children = "No", icon }) => {
    return (
        <div className="btn-group" role="group">
            <button className="btn btn-outline-secondary mb-2" type="button">
                {icon &&<i className={icon + " me-2"}></i>}
                {children}
            </button>

            <button className="btn btn-outline-secondary mb-2" >
                <i className="fa-solid fa-plus"></i>
            </button>


        </div>
    )
}