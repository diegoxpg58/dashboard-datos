import {
  ResponsiveContainer,
  LineChart,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import './GraficoClima.css'

// tipo: 'temperatura' muestra líneas de máxima y mínima
// tipo: 'lluvia' muestra barras de lluvia y una línea de probabilidad
function GraficoClima({ titulo, tipo, filas }) {
  return (
    <div className="grafico">
      <h3 className="grafico-titulo">{titulo}</h3>

      <ResponsiveContainer width="100%" height={300}>
        {tipo === 'temperatura' ? (
          <LineChart data={filas}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
            <YAxis unit="°" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="tempMax"
              name="Máxima (°C)"
              stroke="#ef4444"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="tempMin"
              name="Mínima (°C)"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        ) : (
          <ComposedChart data={filas}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="mm" unit=" mm" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="porcentaje"
              orientation="right"
              unit="%"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="mm"
              dataKey="lluvia"
              name="Lluvia (mm)"
              fill="#60a5fa"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="porcentaje"
              type="monotone"
              dataKey="probabilidad"
              name="Prob. de lluvia (%)"
              stroke="#1e293b"
              strokeWidth={2}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoClima