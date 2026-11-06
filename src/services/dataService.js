import datosLocales from '../data/datos.json'

export async function obtenerDatosVisualizacion() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(datosLocales)
    }, 1000)
  })
}

export function procesarDatos(datos) {
  const etiquetas = datos.map((d) => d.mes)
  const valores = datos.map((d) => d.ventas)

  const totalVentas = valores.reduce((suma, valor) => suma + valor, 0)
  const promedioMensual = totalVentas / datos.length
  const totalClientes = datos.reduce((suma, d) => suma + d.clientes, 0)
  const mejorMes = datos.reduce((mayor, d) => (d.ventas > mayor.ventas ? d : mayor))

  const filas = datos.map((d) => ({
    id: d.id,
    mes: d.mes,
    ventas: d.ventas,
    unidades: d.unidades,
    clientes: d.clientes,
    ticketPromedio: d.ventas / d.clientes,
  }))

  return {
    etiquetas,
    valores,
    filas,
    metricas: {
      totalVentas,
      promedioMensual,
      totalClientes,
      mejorMes: mejorMes.mes,
    },
  }
}

export function formatearMoneda(valor) {
  return valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}