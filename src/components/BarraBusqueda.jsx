export const BarraBusqueda = ({ datos = [], datos2, setDato, setDato2, txtInput = '', setTxtInput, placeholder, focus = false, cumple = false, setCumple, id }) => {

    const input = document.getElementById(`input${id}`)
    const selectDrop = document.getElementById(`drop${id}`)

    const classInputNone = 'd-none'
    const classInputBlock = 'w-100 d-block form-select text-light'

    const dropDown = (valor) => {
        return new Promise(function (resolve) {
            setTxtInput(valor)
            if (input.value == "") {
                selectDrop.className = classInputNone
                setCumple(false)
                setDato({})
            }
            else selectDrop.className = classInputBlock
            resolve();
        });
    }

    function setSize() {
        selectDrop.length < 7 ? selectDrop.size = selectDrop.length : selectDrop.size = 6
        if (selectDrop.length == 0) selectDrop.classList = 'd-none'
    }

    const pushText = (id) => {
        const dato = (datos.find((dato) => dato.id == id));
        input.value = dato.nombre
        setDato(dato)
        const fechaCumple = new Date(new Date().getFullYear(), new Date(dato.fechaNacimiento).getMonth(), new Date(dato.fechaNacimiento).getDate())
        setCumple(fechaCumple > new Date(Date.now() - 432000000) && fechaCumple < new Date(Date.now() + 432000000))
        selectDrop.className = classInputNone
        document.getElementById('input2').focus()
    }

    const putProServ = (id, tipo) => {
        if (tipo == 'p') {
            const producto = (datos2.find((producto) => producto.id == id));
            producto.tipo = 'p'
            producto.idBarber = 12
            input.value = producto.nombre
            setDato(producto)
        } else {
            const servicio = (datos.find((servicio) => servicio.id == id));
            servicio.tipo = 's'
            servicio.idBarber = 12
            input.value = servicio.nombre
            setDato(servicio)
        }
        selectDrop.className = classInputNone
        document.getElementById('btnAdd').focus()
    }

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    return (
        <div>
            <input autoFocus={focus} autoComplete='off' className={cumple ? "form-control me-2 icono-placeholder background" : 'form-control me-2 icono-placeholder'} type="search" placeholder={placeholder} id={`input${id}`}
                onChange={(e) => dropDown(e.target.value).then(setSize)}
                onKeyDown={(e) => {
                    if (e.key == 'ArrowDown') {
                        const inputCli = document.getElementById(`drop${id}`)
                        inputCli.focus()
                        inputCli.firstChild.selected = true
                    }
                }}
            />
            <div className="position-relative">
                <div className='position-absolute w-100' style={{ zIndex: 1 }}>
                    <select id={`drop${id}`} className="w-100 d-none form-select text-success" style={{ backgroundColor: 'rgb(63, 65, 66)' }}
                        onKeyDown={(e) => {
                            if (e.key == 'ArrowUp' && e.target.selectedIndex == 0) { (document.getElementById(`input${id}`)).select() }
                        }}
                        onKeyUp={(e) => {
                            if (e.key == 'Enter') datos2 ? putProServ(e.target.options[e.target.selectedIndex].value, e.target.options[e.target.selectedIndex].dataset.type) : pushText(e.target.options[e.target.selectedIndex].value)
                        }}
                        onClick={(e) => {
                            if (e.target.length == 1) e.target.firstChild.click()
                        }}
                    >
                        {datos2 &&
                            datos.map((dato) => (
                                removeAccents(dato.nombre.toLowerCase()).trim().includes(removeAccents(txtInput.toLowerCase().trim())) &&
                                <option value={dato.id} data-type='s' onClick={(e) => putProServ(dato.id, 's')} key={dato.id}>
                                    {dato.nombre}
                                </option>
                            ))
                        }
                        {datos2 &&
                            datos2.map((dato) => (
                                removeAccents((dato.nombre + ' ' + dato.marca + ' ' + dato.linea).toLowerCase()).trim().includes(removeAccents(txtInput.toLowerCase().trim())) &&
                                <option value={dato.id} data-type='p' onClick={(e) => putProServ(dato.id, 'p')} key={dato.id} className="text-info">
                                    {dato.nombre + ' ' + dato.marca + ' ' + dato.linea + ' ' + dato.contenido}
                                </option>
                            ))
                        }

                        {(!datos2) &&
                            datos.map((dato) => (
                                removeAccents(dato.nombre.toLowerCase()).trim().includes(removeAccents(txtInput.toLowerCase().trim())) &&
                                <option value={dato.id} onClick={(e) => pushText(dato.id)} key={dato.id}>
                                    {dato.nombre}
                                </option>
                            ))
                        }

                    </select>
                </div>
            </div>
        </div>
    )
}
