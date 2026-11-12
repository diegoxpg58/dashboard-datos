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

// Prepara los datos de ventas para mostrarlos en pantalla.
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

// ===================== PRÁCTICA 3.3 y 3.4 =====================

// Ciudades disponibles en el filtro
export const CIUDADES = {
  cdmx: { nombre: 'Ciudad de México', latitud: 19.43, longitud: -99.13 },
  guadalajara: { nombre: 'Guadalajara', latitud: 20.67, longitud: -103.35 },
  monterrey: { nombre: 'Monterrey', latitud: 25.69, longitud: -100.32 },
  cancun: { nombre: 'Cancún', latitud: 21.16, longitud: -86.85 },
}

// Devuelve una fecha en formato "AAAA-MM-DD" sumando o restando días a hoy.
// Ejemplo: obtenerFechaRelativa(-7) = hace 7 días
export function obtenerFechaRelativa(dias) {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + dias)
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

// Valores con los que inicia el dashboard
export function filtrosIniciales() {
  return {
    ciudad: 'cdmx',
    fechaInicio: obtenerFechaRelativa(-7),
    fechaFin: obtenerFechaRelativa(6),
  }
}

// Calcula el promedio de un arreglo de números
function promedio(numeros) {
  return numeros.reduce((suma, n) => suma + n, 0) / numeros.length
}

// Convierte "2026-11-11" en un texto como "mié, 11 nov"
export function formatearFecha(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

// Consulta la API externa (Open-Meteo) y devuelve los datos del clima ya limpios.
// Acepta un rango de fechas (fechaInicio y fechaFin) o un número de días (dias).
export async function obtenerPrediccion(parametros) {
  const params = {
    latitude: parametros.latitud,
    longitude: parametros.longitud,
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    timezone: 'America/Mexico_City',
  }

  if (parametros.fechaInicio && parametros.fechaFin) {
    params.start_date = parametros.fechaInicio
    params.end_date = parametros.fechaFin
  } else {
    params.forecast_days = parametros.dias
  }

  // 1. Petición GET enviando los parámetros
  const respuesta = await apiClient.get('/forecast', { params })

  // 2. Extraer la carga útil (payload) de la respuesta
  const diario = respuesta.data.daily

  if (!diario || !diario.time) {
    throw new Error('La API no devolvió datos de predicción')
  }

  // 3. Limpiar y dar formato a los datos
  const filas = diario.time.map((fecha, i) => ({
    id: i + 1,
    fecha: formatearFecha(fecha),
    tempMax: diario.temperature_2m_max[i] ?? 0,
    tempMin: diario.temperature_2m_min[i] ?? 0,
    lluvia: diario.precipitation_sum[i] ?? 0,
    probabilidad: diario.precipitation_probability_max[i] ?? 0,
  }))

  // 4. Calcular métricas resumen
  const metricas = {
    promedioMax: promedio(filas.map((f) => f.tempMax)),
    promedioMin: promedio(filas.map((f) => f.tempMin)),
    lluviaTotal: filas.reduce((suma, f) => suma + f.lluvia, 0),
    probabilidadMaxima: Math.max(...filas.map((f) => f.probabilidad)),
  }

  // 5. Retornar los datos limpios
  return { filas, metricas }
}