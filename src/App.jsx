import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import DashboardLayout from './components/DashboardLayout'
import PanelFiltros from './components/PanelFiltros'
import TarjetaMetrica from './components/TarjetaMetrica'
import GraficoClima from './components/GraficoClima'
import TablaDatos from './components/TablaDatos'
import {
  CIUDADES,
  filtrosIniciales,
  formatearFecha,
  obtenerPrediccion,
} from './services/dataService'

// Columnas que mostrará la tabla
const COLUMNAS = [
  { clave: 'id', titulo: '#' },
  { clave: 'fecha', titulo: 'Fecha' },
  { clave: 'tempMax', titulo: 'Temp. máx.', formato: (valor) => `${valor} °C` },
  { clave: 'tempMin', titulo: 'Temp. mín.', formato: (valor) => `${valor} °C` },
  { clave: 'lluvia', titulo: 'Lluvia', formato: (valor) => `${valor} mm` },
  { clave: 'probabilidad', titulo: 'Prob. de lluvia', formato: (valor) => `${valor} %` },
]

function App() {
  // ===== Estado global de los filtros =====
  const [filtros, setFiltros] = useState(filtrosIniciales)

  // ===== Estados de los datos =====
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  // ===== Escucha los cambios en "filtros" y vuelve a pedir los datos =====
  useEffect(() => {
    let cancelado = false

    async function cargarDatos() {
      if (!filtros.fechaInicio || !filtros.fechaFin) {
        setError('Selecciona una fecha de inicio y una fecha de fin.')
        setDatos(null)
        return
      }

      if (filtros.fechaInicio > filtros.fechaFin) {
        setError('La fecha de inicio no puede ser mayor que la fecha de fin.')
        setDatos(null)
        return
      }

      setCargando(true)
      setError(null)

      try {
        const ciudad = CIUDADES[filtros.ciudad]
        const resultado = await obtenerPrediccion({
          latitud: ciudad.latitud,
          longitud: ciudad.longitud,
          fechaInicio: filtros.fechaInicio,
          fechaFin: filtros.fechaFin,
        })

        if (!cancelado) {
          setDatos(resultado)
        }
      } catch (err) {
        console.error(err)
        if (!cancelado) {
          setDatos(null)
          if (err.response) {
            setError(`La API respondió con un error (código ${err.response.status}).`)
          } else if (err.request) {
            setError('No se pudo conectar con la API. Revisa tu conexión a internet.')
          } else {
            setError(`Ocurrió un error: ${err.message}`)
          }
        }
      } finally {
        if (!cancelado) {
          setCargando(false)
        }
      }
    }

    cargarDatos()

    // Si el filtro cambia antes de que llegue la respuesta, se ignora la respuesta vieja
    return () => {
      cancelado = true
    }
  }, [filtros])

  const nombreCiudad = CIUDADES[filtros.ciudad].nombre

  return (
    <DashboardLayout
      encabezado={<Navbar />}
      barraLateral={<PanelFiltros filtros={filtros} setFiltros={setFiltros} />}
    >
      <div className="dashboard-titulo">
        <h2>Clima en {nombreCiudad}</h2>
        {filtros.fechaInicio && filtros.fechaFin && (
          <p>
            Del {formatearFecha(filtros.fechaInicio)} al {formatearFecha(filtros.fechaFin)}
          </p>
        )}
      </div>

      {cargando && (
        <div className="aviso aviso-cargando">
          <span className="spinner-dashboard"></span>
          Actualizando datos...
        </div>
      )}

      {error && <div className="aviso aviso-error">⚠️ {error}</div>}

      {datos && (
        <>
          {/* ===== Zona superior: tarjetas de métricas ===== */}
          <section id="metricas" className="zona-metricas">
            <TarjetaMetrica
              titulo="Temp. máxima promedio"
              valor={`${datos.metricas.promedioMax.toFixed(1)} °C`}
            />
            <TarjetaMetrica
              titulo="Temp. mínima promedio"
              valor={`${datos.metricas.promedioMin.toFixed(1)} °C`}
            />
            <TarjetaMetrica
              titulo="Lluvia acumulada"
              valor={`${datos.metricas.lluviaTotal.toFixed(1)} mm`}
            />
            <TarjetaMetrica
              titulo="Mayor prob. de lluvia"
              valor={`${datos.metricas.probabilidadMaxima} %`}
            />
          </section>

          {/* ===== Zona central: gráficos ===== */}
          <section id="graficos" className="zona-graficos">
            <GraficoClima titulo="Temperaturas diarias" tipo="temperatura" filas={datos.filas} />
            <GraficoClima titulo="Lluvia y probabilidad" tipo="lluvia" filas={datos.filas} />
          </section>

          {/* ===== Zona inferior: tabla ===== */}
          <section id="detalle">
            <h3 className="seccion-subtitulo">Detalle diario</h3>
            <TablaDatos columnas={COLUMNAS} filas={datos.filas} />
          </section>
        </>
      )}
    </DashboardLayout>
  )
}

export default App