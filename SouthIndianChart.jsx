import React from 'react';
import { getSouthIndianData, RASIS } from '../engines/astrologyEngine.js';

const PLANET_ABBR = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};
const PLANET_COLOR = {
  Sun: '#FF9933', Moon: '#B0C4DE', Mars: '#DC143C', Mercury: '#32CD32',
  Jupiter: '#FFD700', Venus: '#FF69B4', Saturn: '#708090', Rahu: '#9370DB', Ketu: '#CD853F',
};

export default function SouthIndianChart({ kundali, size = 320, theme = 'dark' }) {
  if (!kundali) return null;

  const grid = getSouthIndianData(kundali);
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D0A1E' : '#FFF8F0';
  const stroke = isDark ? '#6B46C1' : '#8B4513';
  const textColor = isDark ? '#E2D9F3' : '#3D1C02';
  const lagnaHighlight = isDark ? 'rgba(124,58,237,0.3)' : 'rgba(212,135,10,0.2)';
  const cellSize = size / 4;

  return (
    <div style={{ display: 'inline-block', filter: 'drop-shadow(0 4px 24px rgba(124,58,237,0.3))' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        {/* Background */}
        <rect width={size} height={size} fill={bg} rx="4" />

        {grid.map((row, ri) =>
          row.map((cell, ci) => {
            if (!cell) {
              // Center cells (empty)
              return (
                <rect
                  key={`${ri}-${ci}`}
                  x={ci * cellSize}
                  y={ri * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={isDark ? '#080616' : '#FFF0DC'}
                  stroke={stroke}
                  strokeWidth="1"
                />
              );
            }

            const x = ci * cellSize;
            const y = ri * cellSize;

            return (
              <g key={`${ri}-${ci}`}>
                <rect
                  x={x} y={y}
                  width={cellSize} height={cellSize}
                  fill={cell.isLagna ? lagnaHighlight : 'transparent'}
                  stroke={cell.isLagna ? (isDark ? '#7C3AED' : '#D4870A') : stroke}
                  strokeWidth={cell.isLagna ? 2 : 1}
                />

                {/* Lagna triangle indicator */}
                {cell.isLagna && (
                  <polygon
                    points={`${x},${y} ${x + 14},${y} ${x},${y + 14}`}
                    fill={isDark ? '#7C3AED' : '#D4870A'}
                    opacity="0.8"
                  />
                )}

                {/* House number */}
                {cell.houseNum && (
                  <text
                    x={x + cellSize - 6}
                    y={y + 10}
                    textAnchor="middle"
                    fontSize="8"
                    fill={isDark ? '#6B7280' : '#A0856B'}
                    fontFamily="serif"
                    opacity="0.6"
                  >
                    {cell.houseNum}
                  </text>
                )}

                {/* Rasi name */}
                <text
                  x={x + cellSize / 2}
                  y={y + 22}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isDark ? '#A78BFA' : '#8B4513'}
                  fontFamily="sans-serif"
                  fontWeight="500"
                >
                  {cell.rasiName?.slice(0, 3)}
                </text>

                {/* Rasi number (0-indexed as 1-12) */}
                <text
                  x={x + 7}
                  y={y + 11}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isDark ? '#4B5563' : '#C4A882'}
                  fontFamily="serif"
                  opacity="0.5"
                >
                  {cell.rasi + 1}
                </text>

                {/* Planets */}
                {cell.planets?.map((planet, pi) => (
                  <text
                    key={planet}
                    x={x + (pi % 3) * (cellSize / 3) + cellSize / 6}
                    y={y + 38 + Math.floor(pi / 3) * 14}
                    textAnchor="middle"
                    fontSize="9.5"
                    fill={PLANET_COLOR[planet] || '#ccc'}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {PLANET_ABBR[planet]}
                  </text>
                ))}
              </g>
            );
          })
        )}

        {/* Outer border */}
        <rect
          x="1" y="1" width={size - 2} height={size - 2}
          fill="none"
          stroke={isDark ? '#7C3AED' : '#D4870A'}
          strokeWidth="2"
          rx="4"
        />

        {/* Center label */}
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          fontSize="11"
          fill={isDark ? '#4C1D95' : '#C4A882'}
          fontFamily="serif"
          opacity="0.5"
        >
          🕉
        </text>
        <text
          x={size / 2}
          y={size / 2 + 8}
          textAnchor="middle"
          fontSize="8"
          fill={isDark ? '#374151' : '#D4C4A8'}
          fontFamily="sans-serif"
          opacity="0.5"
        >
          KUNDALI
        </text>
      </svg>
    </div>
  );
}
