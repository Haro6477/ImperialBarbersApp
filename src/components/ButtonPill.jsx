import React from 'react'

export const ButtonPill = ({ children = "No", icon = "" }) => {
    return (
        <button className="btn btn-info rounded-pill mb-2" type="button">
            {icon && <i className={icon + " me-2"}></i>}
            {children}
        </button>
    )
}
