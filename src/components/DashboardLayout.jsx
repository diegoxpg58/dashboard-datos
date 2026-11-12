import './DashboardLayout.css'

// encabezado: barra superior
// barraLateral: filtros
// children: contenido del área principal
function DashboardLayout({ encabezado, barraLateral, children }) {
  return (
    <div className="dashboard">
      <header className="dashboard-encabezado">{encabezado}</header>

      <aside className="dashboard-lateral">
        <nav className="dashboard-menu">
          <a href="#metricas">📊 Métricas</a>
          <a href="#graficos">📈 Gráficos</a>
          <a href="#detalle">📋 Detalle diario</a>
        </nav>
        {barraLateral}
      </aside>

      <main className="dashboard-principal">{children}</main>
    </div>
  )
}

export default DashboardLayout