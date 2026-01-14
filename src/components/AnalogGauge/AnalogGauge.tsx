import "./AnalogGauge.css";

interface Props {
  value: number;
  max: number;
  label: string;
  steps?: number;
}

export const AnalogGauge: React.FC<Props> = ({
  value,
  max,
  label,
  steps = 20,
}) => {
  const startingAngle = -120;
  const endingAngle = 120;
  const totalAngle = endingAngle - startingAngle;

  const clampedValue = Math.min(Math.max(value, 0), max);
  const rotation = startingAngle + (clampedValue / max) * totalAngle;

  const ticks = [];
  const smallStep = steps / 2;

  for (let i = 0; i <= max; i += smallStep) {
    const isBigTick = i % steps === 0;
    const tickAngle = startingAngle + (i / max) * totalAngle;

    ticks.push(
      <div
        key={i}
        className={`tick ${isBigTick ? "big" : "small"}`}
        style={{ transform: `rotate(${tickAngle}deg)` }}
      >
        {isBigTick && (
          <span
            className="tick-number"
            style={{ transform: `rotate(${-tickAngle}deg)` }}
          >
            {i}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="gauge-container">
        <div className="gauge-body">
            <div className="ticks-wrapper">{ticks}</div>
            <div className="gauge-label">{label}</div>
            <div 
                className="needle"
                style={{ transform : `rotate(${rotation}deg)`}}
            />
            <div className="needle-cap" />
        </div>
    </div>
  )
};
