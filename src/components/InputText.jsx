import React from 'react'

export function InputText({classIcon, placeholder, value, state}) {
    
    return (
        <div className="input-group mb-3">
            <span className="input-group-text"><i className={classIcon}></i></span>
            <input type="text" className="form-control" placeholder={placeholder} value={value}
                onChange={state(value)}
            />
        </div>
    )
}

