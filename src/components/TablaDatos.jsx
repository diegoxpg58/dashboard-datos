import './TablaDatos.css'
import { formatearMoneda } from '../services/dataService'

function TablaDatos({ filas }) {
  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Mes</th>
            <th>Ventas</th>
            <th>Unidades</th>
            <th>Clientes</th>
            <th>Ticket promedio</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id}>
              <td>{fila.id}</td>
              <td>{fila.mes}</td>
              <td>{formatearMoneda(fila.ventas)}</td>
              <td>{fila.unidades}</td>
              <td>{fila.clientes}</td>
              <td>{formatearMoneda(fila.ticketPromedio)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaDatos