import datosLocales from '../data/datos.json'
import apiClient from './apiClient'

// ===================== PRÁCTICA 3.2 =====================

// Simula una petición HTTP: devuelve una Promesa que se resuelve
// después de 1 segundo con el contenido del JSON local.
export async function obtenerDatosVisualizacion() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(datosLocales)
    }, 1000)
  })
}

// Prepara los datos para mostrarlos en pantalla:
// extrae etiquetas y valores, calcula métricas y agrega columnas nuevas.
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

// Convierte un número a formato de moneda mexicana: 45200 -> $45,200.00
export function formatearMoneda(valor) {
  return valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}

// ===================== PRACTICA 3.3 =====================
function promedio(numeros) {
  return numeros.reduce((suma, n) => suma + n, 0) / numeros.length
}

function formatearFecha(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export async function obtenerPrediccion(parametros) {
  const respuesta = await apiClient.get('/forecast', {
    params: {
      latitude: parametros.latitud,
      longitude: parametros.longitud,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
      forecast_days: parametros.dias,
      timezone: 'America/Mexico_City',
    },
  })

  const diario = respuesta.data.daily

  if (!diario || !diario.time) {
    throw new Error('La API no devolvió datos de predicción')
  }

  const filas = diario.time.map((fecha, i) => ({
    id: i + 1,
    fecha: formatearFecha(fecha),
    tempMax: diario.temperature_2m_max[i] ?? 0,
    tempMin: diario.temperature_2m_min[i] ?? 0,
    lluvia: diario.precipitation_sum[i] ?? 0,
    probabilidad: diario.precipitation_probability_max[i] ?? 0,
  }))

  const metricas = {
    promedioMax: promedio(filas.map((f) => f.tempMax)),
    promedioMin: promedio(filas.map((f) => f.tempMin)),
    lluviaTotal: filas.reduce((suma, f) => suma + f.lluvia, 0),
    probabilidadMaxima: Math.max(...filas.map((f) => f.probabilidad)),
  }

  return { filas, metricas }
}