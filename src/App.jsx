import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import TarjetaMetrica from './components/TarjetaMetrica'
import TablaDatos from './components/TablaDatos'
import {
  obtenerDatosVisualizacion,
  procesarDatos,
  formatearMoneda,
} from './services/dataService'

function App() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuesta = await obtenerDatosVisualizacion()
        const datosProcesados = procesarDatos(respuesta)
        setDatos(datosProcesados)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los datos')
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  return (
    <>
      <Navbar />

      <main className="contenedor">
        <h2 className="seccion-titulo">Resumen de ventas 2025</h2>

        {cargando && <p className="mensaje">Cargando datos...</p>}

        {error && <p className="mensaje mensaje-error">{error}</p>}

        {datos && (
          <>
            <section className="tarjetas">
              <TarjetaMetrica
                titulo="Ventas totales"
                valor={formatearMoneda(datos.metricas.totalVentas)}
              />
              <TarjetaMetrica
                titulo="Promedio mensual"
                valor={formatearMoneda(datos.metricas.promedioMensual)}
              />
              <TarjetaMetrica
                titulo="Total de clientes"
                valor={datos.metricas.totalClientes.toLocaleString('es-MX')}
              />
              <TarjetaMetrica
                titulo="Mejor mes"
                valor={datos.metricas.mejorMes}
              />
            </section>

            <h2 className="seccion-titulo">Detalle mensual</h2>
            <TablaDatos filas={datos.filas} />
          </>
        )}
      </main>
    </>
  )
}

export default App