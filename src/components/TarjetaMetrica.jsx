import './TarjetaMetrica.css'

function TarjetaMetrica({ titulo, valor }) {
  return (
    <div className="tarjeta">
      <p className="tarjeta-titulo">{titulo}</p>
      <p className="tarjeta-valor">{valor}</p>
    </div>
  )
}

export default TarjetaMetrica