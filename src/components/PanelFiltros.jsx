import './PanelFiltros.css'
import { CIUDADES, obtenerFechaRelativa, filtrosIniciales } from '../services/dataService'

function PanelFiltros({ filtros, setFiltros }) {
  // Actualiza solo el filtro que cambió, conservando los demás
  function manejarCambio(evento) {
    const { name, value } = evento.target
    setFiltros((filtrosAnteriores) => ({
      ...filtrosAnteriores,
      [name]: value,
    }))
  }

  function restablecer() {
    setFiltros(filtrosIniciales())
  }

  return (
    <div className="filtros">
      <h2 className="filtros-titulo">Filtros</h2>

      <label className="filtros-campo">
        Ciudad
        <select name="ciudad" value={filtros.ciudad} onChange={manejarCambio}>
          {Object.entries(CIUDADES).map(([clave, ciudad]) => (
            <option key={clave} value={clave}>
              {ciudad.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="filtros-campo">
        Fecha de inicio
        <input
          type="date"
          name="fechaInicio"
          value={filtros.fechaInicio}
          min={obtenerFechaRelativa(-30)}
          max={obtenerFechaRelativa(15)}
          onChange={manejarCambio}
        />
      </label>

      <label className="filtros-campo">
        Fecha de fin
        <input
          type="date"
          name="fechaFin"
          value={filtros.fechaFin}
          min={obtenerFechaRelativa(-30)}
          max={obtenerFechaRelativa(15)}
          onChange={manejarCambio}
        />
      </label>

      <button type="button" className="filtros-boton" onClick={restablecer}>
        Restablecer filtros
      </button>

      <p className="filtros-nota">
        Puedes consultar desde hace 30 días hasta 15 días en el futuro.
      </p>
    </div>
  )
}

export default PanelFiltros