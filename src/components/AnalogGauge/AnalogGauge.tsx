import React from "react";

interface Props {
  value: number;        
  max: number;          
  label: string;        
  steps?: number;       
  limit?: number;       
  redZoneStart?: number;
}

export const AnalogGauge: React.FC<Props> = ({
  value,
  max,
  label,
  steps = 20,
  limit,
  redZoneStart = max * 0.8, 
}) => {
  const size = 300;       
  const radius = 120;     
  const center = size / 2;
  const strokeWidth = 4;
  
  const startAngle = -120;
  const endAngle = 120;
  const totalAngle = endAngle - startAngle;

  const valueToAngle = (val: number) => {
    const clamped = Math.min(Math.max(val, 0), max);
    return startAngle + (clamped / max) * totalAngle;
  };

  const polarToCartesian = (angle: number, r: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: center + r * Math.cos(radians),
      y: center + r * Math.sin(radians),
    };
  };

  const describeArc = (startVal: number, endVal: number, r: number) => {
    const startA = valueToAngle(startVal);
    const endA = valueToAngle(endVal);
    
    const start = polarToCartesian(endA, r);
    const end = polarToCartesian(startA, r);
    const largeArcFlag = endA - startA <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y, 
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const renderTicks = () => {
    const ticksElements = [];
    const smallStep = steps >= 10 ? steps / 2 : steps / 2; 

    for (let i = 0; i <= max; i += smallStep) {
      const isBigTick = i % steps === 0;
      const angle = valueToAngle(i);
      const p1 = polarToCartesian(angle, radius);
      const p2 = polarToCartesian(angle, radius - (isBigTick ? 15 : 8)); 
      const isRedZone = i >= redZoneStart;
      const tickColor = isRedZone ? "#ff3333" : "#00f0ff";

      ticksElements.push(
        <line
          key={`line-${i}`}
          x1={p1.x} y1={p1.y}
          x2={p2.x} y2={p2.y}
          stroke={tickColor}
          strokeWidth={isBigTick ? 3 : 1}
        />
      );

      if (isBigTick) {
        const textPos = polarToCartesian(angle, radius - 35);
        ticksElements.push(
          <text
            key={`txt-${i}`}
            x={textPos.x} y={textPos.y}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {i}
          </text>
        );
      }
    }
    return ticksElements;
  };

  const renderLimit = () => {
    if (limit === undefined) return null;
    const limitAngle = valueToAngle(limit);
    const pos = polarToCartesian(limitAngle, radius + 15); 

    return (
      <g transform={`rotate(${limitAngle}, ${pos.x}, ${pos.y})`}>
        <polygon 
          points={`${pos.x},${pos.y} ${pos.x - 6},${pos.y - 12} ${pos.x + 6},${pos.y - 12}`} 
          fill="#ff0000ff"
        />
        <text 
            x={pos.x} y={pos.y - 15} 
            fill="#ff0000ff" 
            fontSize="9" 
            textAnchor="middle"
            transform={`rotate(-${limitAngle}, ${pos.x}, ${pos.y - 15})`} 
        >
            LIMIT
        </text>
      </g>
    );
  };

  const needleAngle = valueToAngle(value);

  return (
    <div className="gauge-container" style={{ width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size}>
        <path 
          d={describeArc(0, max, radius)} 
          fill="none" 
          stroke="#333" 
          strokeWidth={strokeWidth} 
          strokeLinecap="round"
        />
        <path 
          d={describeArc(redZoneStart, max, radius)} 
          fill="none" 
          stroke="#ff0000" 
          strokeWidth={strokeWidth + 2} 
          opacity="0.7"
          strokeLinecap="round"
        />
        {renderTicks()}
        {renderLimit()}
        <g transform={`rotate(${needleAngle}, ${center}, ${center})`} style={{ transition: 'transform 0.1s ease-out' }}>
            <line 
                x1={center} y1={center} 
                x2={center} y2={center - radius + 10} 
                stroke="#ff3333" 
                strokeWidth="4" 
                strokeLinecap="round" 
            />
            <circle cx={center} cy={center} r="6" fill="#444" stroke="#222" strokeWidth="2" />
        </g>
        <text x={center} y={center + 50} fill="#888" fontSize="14" textAnchor="middle">
          {label}
        </text>
      </svg>
    </div>
  );
};