import React from 'react'
import { ConectorPluginV3 } from './plugin'
const municipio = import.meta.env.VITE_MUNICIPIO

export const ImprimirTicket = (idCobro, descuento, subtotal, listaServicios = [], listaProductos = [], total, pagoEfectivo = 0, pagoTarjeta = 0, pagoPts = 0, cliente, barber, pts) => {
    const date = new Date();
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getUTCDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let hh = date.getHours()
    let min = date.getMinutes()
    let ss = date.getSeconds()
    if (hh < 10) hh = '0' + hh;
    if (min < 10) min = '0' + min;
    if (ss < 10) ss = '0' + ss;


    const fechaFormateada = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;

    const conector = new ConectorPluginV3();
    const respuesta = conector
        .Iniciar()
        .DeshabilitarElModoDeCaracteresChinos()
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
    if (municipio == 1) {
        conector.CargarImagenLocalEImprimir('C:/Users/TheKingBarber/Pictures/darkLogoImperial.png', 0, 216)
    } else {
        conector.CargarImagenLocalEImprimir('C:/Users/imper/Pictures/darkLogoImperial.png', 0, 216)
    }
    conector.Feed(1)
        .EscribirTexto("IMPERIAL BARBERS\n")
    if (municipio == 1) {
        conector.TextoSegunPaginaDeCodigos(2, "cp850", "Av. Hidalgo 411, Teziutlán, Pue. 73800 Teziutlán Centro\n")
            .TextoSegunPaginaDeCodigos(2, "cp850", "Teléfono: 231 176 2907\n\n")
    } else {
        conector.TextoSegunPaginaDeCodigos(2, "cp850", "Av. Reforma No. 157, Tlatlauquitepec, Pue. 73900\n")
            .TextoSegunPaginaDeCodigos(2, "cp850", "Teléfono: 233 104 1774\n\n")
    }
    conector.EscribirTexto("Atendido por:\n" + barber + "\n")
        .EscribirTexto("Fecha y hora:\n" + fechaFormateada)
        .EscribirTexto("\n________________________________\n")
    listaServicios.forEach(servicio => {
        conector.EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
            .TextoSegunPaginaDeCodigos(2, "cp850", servicio.cantidad + '  ' + servicio.nombre + '\n')
            .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
            .EscribirTexto('$' + servicio.precio * servicio.cantidad + '.00\n')
    })
    listaProductos.forEach(producto => {
        conector.EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
            .TextoSegunPaginaDeCodigos(2, "cp850", producto.cantidad + '  ' + producto.nombre + '\n')
            .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
            .EscribirTexto('$' + producto.precio * producto.cantidad + '.00\n')
    })
    conector.EscribirTexto("________________________________\n")
        .EstablecerEnfatizado(true)
    if (descuento > 0) {
        conector.EscribirTexto('SUBTOTAL: $' + subtotal + ".00\n")
            .EstablecerSubrayado(true)
            .EscribirTexto('DESCUENTO: $' + descuento + ".00\n")
            .EstablecerSubrayado(false)
            .EscribirTexto('TOTAL: $' + (total) + '.00\n')
        console.log('total: ' + total + '\ndescuento: ' + descuento + '\nsubtotal: ' + subtotal)
    } else {
        conector.EscribirTexto('TOTAL: $' + total + ".00\n")
    }
    conector.EstablecerEnfatizado(false)
    if (pagoEfectivo > 0) conector.EscribirTexto('\nPago en efectivo: $' + pagoEfectivo + ".00\n")
    if (pagoTarjeta > 0) conector.EscribirTexto('Pago con tarjeta: $' + pagoTarjeta + ".00\n")
    if (pagoPts > 0) conector.EscribirTexto('Pago pts: ' + pagoPts + " pts. = $" + pagoPts / 2 + ".00\n")
    conector.Feed(1)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
        .EstablecerEnfatizado(true)
        .EstablecerTamañoFuente(1, 1)
        .TextoSegunPaginaDeCodigos(2, "cp850", cliente + "\n")
        .EscribirTexto("Puntos: " + pts + " pts.\n")
        .Feed(1)
        .EstablecerEnfatizado(false)
        .TextoSegunPaginaDeCodigos(2, "cp850", "¡Gracias por su compra!\n")
        .Feed(2)
        .EscribirTexto("________________________________\n")
        .EscribirTexto("________________________________\n\n")
        .TextoSegunPaginaDeCodigos(2, "cp850", "Número del programador:\n231 117 1737")
        .Pulso(49, 60, 120)
        .imprimirEn("Termica2");
    if (respuesta) {
    } else {
        alert("Error: " + respuesta);
    }
}

export const ImprimirReporte = (total, efectivo, tarjeta, puntosCanjeados, barber, retiros, ingresos, totalRetiros, totalIngresos) => {
    const date = new Date()
    let hh = date.getHours()
    let min = date.getMinutes()
    let ss = date.getSeconds()
    if (hh < 10) hh = '0' + h;
    if (min < 10) min = '0' + min;
    if (ss < 10) ss = '0' + ss;
    const hora = hh + ':' + min + ':' + ss;

    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const conector = new ConectorPluginV3();
    const respuesta = conector
        .Iniciar()
        .DeshabilitarElModoDeCaracteresChinos()
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
        .EstablecerEnfatizado(true)
        .TextoSegunPaginaDeCodigos(2, "cp850", date.toLocaleDateString('es-MX', options) + "\n\n")
        .EstablecerEnfatizado(false)
        .EscribirTexto("Reporte realizado por:\n" + barber + "\n")
        .TextoSegunPaginaDeCodigos(2, "cp850", "Hora de impresión:\n" + hora)
        .EscribirTexto("\n________________________________\n")
        .EstablecerEnfatizado(true)
        .EscribirTexto('\nTOTAL: $' + total + ".00\n\n")
        .EstablecerEnfatizado(false)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
    if (efectivo > 0) conector.EscribirTexto('Efectivo: $' + efectivo + ".00\n")
    if (tarjeta > 0) conector.TextoSegunPaginaDeCodigos(2, "cp850", 'Dinero electrónico: $' + tarjeta + ".00\n")
    if (puntosCanjeados > 0) conector.EscribirTexto('Puntos: ' + puntosCanjeados + " pts. = $" + puntosCanjeados / 2 + ".00\n")
    conector.Feed(1)
    if (ingresos.length > 0) {
        conector.EscribirTexto('INGRESOS:\n')
        ingresos.forEach(ingreso => {
            conector.EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
                .TextoSegunPaginaDeCodigos(2, "cp850", ingreso.concepto + '\n')
                .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
                .EscribirTexto('$' + ingreso.cantidad + ".00\n")
        });
        conector.EscribirTexto("________________________________\n")
            .EscribirTexto("$" + totalIngresos + ".00\n")
    }
    conector.Feed(1)
    if (retiros.length > 0) {
        conector.EscribirTexto('RETIROS:\n')
        retiros.forEach(retiro => {
            conector.EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
                .TextoSegunPaginaDeCodigos(2, "cp850", retiro.concepto + '\n')
                .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
                .EscribirTexto('$' + retiro.cantidad + ".00\n")
        });
        conector.EscribirTexto("________________________________\n")
            .EscribirTexto("$" + totalRetiros + ".00\n")
    }
    conector.Pulso(49, 60, 120)
    conector.imprimirEn("Termica2")
    if (respuesta) {
    } else {
        alert("Error: " + respuesta);
    }
}

export const abrirCajon = () => {
    const conector = new ConectorPluginV3()
    conector.Iniciar()
    conector.Pulso(49, 60, 120)
    const respuesta = conector
        .imprimirEn("Termica2");
    if (respuesta === true) {
        console.log("Impreso correctamente");
    } else {
        alert("Error: " + respuesta);
    }
}
export const abrirCajon2 = () => {
    const conector = new ConectorPluginV3()
    conector.Iniciar()
    conector.Pulso(49, 60, 120)
    const respuesta = conector
    if (respuesta === true) {
        console.log("Impreso correctamente");
    } else {
        alert("Error: " + respuesta);
    }
}