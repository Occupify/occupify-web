import { useState } from 'react'
import { ChartLineUpIcon } from '@phosphor-icons/react'
import type { CashflowMonthData } from '../types'

export interface CashflowLineChartProps {
  data: CashflowMonthData[]
}

export function CashflowLineChart({ data }: CashflowLineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(
    data.length > 0 ? data.length - 1 : null,
  )

  const chartW = 760
  const chartH = 240
  const padLeft = 60
  const padRight = 40
  const padTop = 24
  const padBottom = 36
  const plotW = chartW - padLeft - padRight
  const plotH = chartH - padTop - padBottom
  const maxY = 50

  const pointsIn = data.map((d, i) => {
    const x = padLeft + (i / Math.max(1, data.length - 1)) * plotW
    const y = padTop + plotH - (d.inVal / maxY) * plotH
    return { x, y }
  })

  const pointsOut = data.map((d, i) => {
    const x = padLeft + (i / Math.max(1, data.length - 1)) * plotW
    const y = padTop + plotH - (d.outVal / maxY) * plotH
    return { x, y }
  })

  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (!pts.length) return ''
    let path = `M ${pts[0].x},${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i]
      const p1 = pts[i + 1]
      const cp1x = p0.x + (p1.x - p0.x) / 2
      const cp1y = p0.y
      const cp2x = p0.x + (p1.x - p0.x) / 2
      const cp2y = p1.y
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`
    }
    return path
  }

  const pathIn = createSmoothPath(pointsIn)
  const pathOut = createSmoothPath(pointsOut)
  const areaIn = pointsIn.length
    ? `${pathIn} L ${pointsIn[pointsIn.length - 1].x},${padTop + plotH} L ${pointsIn[0].x},${padTop + plotH} Z`
    : ''
  const areaOut = pointsOut.length
    ? `${pathOut} L ${pointsOut[pointsOut.length - 1].x},${padTop + plotH} L ${pointsOut[0].x},${padTop + plotH} Z`
    : ''

  const activeData = hoveredIndex !== null && data[hoveredIndex] ? data[hoveredIndex] : null
  const activePtIn = hoveredIndex !== null && pointsIn[hoveredIndex] ? pointsIn[hoveredIndex] : null
  const activePtOut =
    hoveredIndex !== null && pointsOut[hoveredIndex] ? pointsOut[hoveredIndex] : null

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all mb-6">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <ChartLineUpIcon size={20} weight="bold" className="text-[#0A66C2]" />
            <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Biến động thu chi
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
            Biểu đồ trực quan so sánh dòng tiền vào và ra trong 6 tháng gần nhất
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs" />
            <span>Tiền vào</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200/60">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-xs" />
            <span>Tiền ra</span>
          </div>
        </div>
      </div>

      {/* SVG chart container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="w-full h-auto block min-w-[600px] select-none"
        >
          <defs>
            <linearGradient id="cfInGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="cfOutGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
            </linearGradient>
            <filter id="shadowIn" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.25" />
            </filter>
            <filter id="shadowOut" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#F43F5E" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {[0, 10, 20, 30, 40, 50].map((val) => {
            const y = padTop + plotH - (val / maxY) * plotH
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartW - padRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1.2"
                  strokeDasharray={val === 0 ? undefined : '4 4'}
                />
                <text
                  x={padLeft - 12}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {val === 0 ? '0 ₫' : `${val} tr`}
                </text>
              </g>
            )
          })}

          {/* Area fills */}
          {areaIn && <path d={areaIn} fill="url(#cfInGrad)" />}
          {areaOut && <path d={areaOut} fill="url(#cfOutGrad)" />}

          {/* Lines */}
          {pathIn && (
            <path
              d={pathIn}
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadowIn)"
            />
          )}
          {pathOut && (
            <path
              d={pathOut}
              fill="none"
              stroke="#F43F5E"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadowOut)"
            />
          )}

          {/* Vertical guideline & dots for hovered point */}
          {activePtIn && activePtOut && hoveredIndex !== null && (
            <g>
              <line
                x1={activePtIn.x}
                y1={padTop}
                x2={activePtIn.x}
                y2={padTop + plotH}
                stroke="#CBD5E1"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <circle
                cx={activePtIn.x}
                cy={activePtIn.y}
                r="7"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="3"
                className="transition-all"
              />
              <circle
                cx={activePtOut.x}
                cy={activePtOut.y}
                r="7"
                fill="#F43F5E"
                stroke="#FFFFFF"
                strokeWidth="3"
                className="transition-all"
              />
            </g>
          )}

          {/* X-axis labels and hover hit areas */}
          {data.map((d, i) => {
            const x = padLeft + (i / Math.max(1, data.length - 1)) * plotW
            const isHovered = hoveredIndex === i
            return (
              <g
                key={d.month}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
              >
                {/* Transparent hit area */}
                <rect
                  x={x - plotW / Math.max(1, data.length - 1) / 2}
                  y={padTop}
                  width={plotW / Math.max(1, data.length - 1)}
                  height={plotH + padBottom}
                  fill="transparent"
                />
                {pointsIn[i] && (
                  <circle
                    cx={pointsIn[i].x}
                    cy={pointsIn[i].y}
                    r={isHovered ? 5 : 3.5}
                    fill="#10B981"
                    opacity={isHovered ? 1 : 0.7}
                  />
                )}
                {pointsOut[i] && (
                  <circle
                    cx={pointsOut[i].x}
                    cy={pointsOut[i].y}
                    r={isHovered ? 5 : 3.5}
                    fill="#F43F5E"
                    opacity={isHovered ? 1 : 0.7}
                  />
                )}
                <text
                  x={x}
                  y={chartH - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#0A66C2' : '#64748B'}
                  fontWeight={isHovered ? '800' : '600'}
                  fontSize="12"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {d.month}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Floating Tooltip Card */}
        {activeData && activePtIn && hoveredIndex !== null && (
          <div
            style={{
              left: `${(activePtIn.x / chartW) * 100}%`,
              transform: 'translate(-50%, 0)',
            }}
            className="absolute top-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/90 p-3.5 pointer-events-none z-10 min-w-[190px] whitespace-nowrap transition-all"
          >
            <div className="text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-1.5 mb-2">
              {activeData.month} / 2026
            </div>
            <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Tiền vào:
              </span>
              <span className="font-extrabold text-emerald-600 font-mono">
                {activeData.formattedIn}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs mb-2">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Tiền ra:
              </span>
              <span className="font-extrabold text-rose-600 font-mono">
                {activeData.formattedOut}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 font-medium">Thặng dư ròng:</span>
              <span className="text-[#0A66C2] font-mono font-extrabold">{activeData.net}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
