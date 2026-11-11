import { useState } from 'react'
import './PanelAnalitico.css'
import './TablaDatos.css'
import TarjetaMetrica from './TarjetaMetrica'
import { obtenerPrediccion } from '../services/dataService'

const CIUDADES = [
  { nombre: 'Ciudad de México', latitud: 19.43, longitud: -99.13 },
  { nombre: 'Guadalajara', latitud: 20.67, longitud: -103.35 },
  { nombre: 'Monterrey', latitud: 25.69, longitud: -100.32 },
  { nombre: 'Cancún', latitud: 21.16, longitud: -86.85 },
]

function PanelAnalitico() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [ciudadIndice, setCiudadIndice] = useState(0)
  const [dias, setDias] = useState(7)

  async function manejarEnvio(evento) {
    evento.preventDefault() 

    setCargando(true)
    setError(null)
    setDatos(null)

    try {
      const ciudad = CIUDADES[ciudadIndice]
      const resultado = await obtenerPrediccion({
        latitud: ciudad.latitud,
        longitud: ciudad.longitud,
        dias: dias,
      })
      setDatos(resultado)
    } catch (err) {
      console.error(err)
      if (err.response) {
        setError(`La API respondió con un error (código ${err.response.status}).`)
      } else if (err.request) {
        setError('No se pudo conectar con la API. Revisa tu conexión a internet.')
      } else {
        setError(`Ocurrió un error: ${err.message}`)
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="panel">
      <h2 className="seccion-titulo">Predicción del clima (API Open-Meteo)</h2>

      <form className="panel-formulario" onSubmit={manejarEnvio}>
        <label>
          Ciudad
          <select
            value={ciudadIndice}
            onChange={(e) => setCiudadIndice(Number(e.target.value))}
          >
            {CIUDADES.map((ciudad, i) => (
              <option key={ciudad.nombre} value={i}>
                {ciudad.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Días a predecir
          <select value={dias} onChange={(e) => setDias(Number(e.target.value))}>
            <option value={3}>3 días</option>
            <option value={7}>7 días</option>
            <option value={14}>14 días</option>
          </select>
        </label>

        <button type="submit" disabled={cargando}>
          {cargando ? 'Analizando...' : 'Analizar datos'}
        </button>
      </form>

      {cargando && (
        <div className="panel-cargando">
          <span className="spinner"></span>
          Analizando datos...
        </div>
      )}

      {error && <div className="panel-error">⚠️ {error}</div>}

      {datos && (
        <>
          <div className="tarjetas">
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
          </div>

          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Temp. máx.</th>
                  <th>Temp. mín.</th>
                  <th>Lluvia</th>
                  <th>Prob. de lluvia</th>
                </tr>
              </thead>
              <tbody>
                {datos.filas.map((fila) => (
                  <tr key={fila.id}>
                    <td>{fila.id}</td>
                    <td>{fila.fecha}</td>
                    <td>{fila.tempMax} °C</td>
                    <td>{fila.tempMin} °C</td>
                    <td>{fila.lluvia} mm</td>
                    <td>{fila.probabilidad} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}

export default PanelAnalitico