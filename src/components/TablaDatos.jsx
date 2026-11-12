import './TablaDatos.css'

function TablaDatos({ columnas, filas }) {
  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave}>{columna.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={columnas.length}>No hay datos para los filtros seleccionados.</td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr key={fila.id}>
                {columnas.map((columna) => (
                  <td key={columna.clave}>
                    {columna.formato ? columna.formato(fila[columna.clave]) : fila[columna.clave]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TablaDatos