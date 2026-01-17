import "./phoneStyles.css";
import { useTelemetry } from "../../hooks/useTelemetry";
import { AnalogGauge } from "../../components/AnalogGauge/AnalogGauge";
import { useEffect, useState, useRef } from "react"; 
import { Link } from "react-router-dom";
import { Odometer } from "../../components/Odometer/Odometer";

export const PhonePage = () => {
  const data = useTelemetry();
  const speed = Math.floor(data?.truck?.speed || 0);
  const rpm = Math.floor(data?.truck?.rpm || 0);
  const mil = Math.floor(data?.truck?.odometer || 0)

  const [speedLimit, setSpeedLimit] = useState<number>();
  const [redZoneRange, setRedZoneRange] = useState<number>();
  const [mileage, setMileage] = useState(() => {
    const saved = localStorage.getItem("my_car_mileage");
    return saved ? parseFloat(saved) : 23500.4;
  });

  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    localStorage.setItem("my_car_mileage", mileage.toString());
  }, [mileage]);

  useEffect(() => {
    const thickRate = 100;

    const driveInterval = setInterval(() => {
      const currentSpeed = speedRef.current;

      setMileage((prevMileage) => {
        if (currentSpeed < 0.1) return prevMileage;

        const hoursPassed = thickRate / 1000 / 3600;
        const distanceCovered = currentSpeed * hoursPassed;

        return prevMileage + distanceCovered;
      });
    }, thickRate);

    return () => clearInterval(driveInterval);
  }, []); 

  useEffect(() => {
    const limits = [50, 80, 90];

    const interval = setInterval(() => {
      const randomLimit = limits[Math.floor(Math.random() * limits.length)];
      setSpeedLimit(randomLimit);
      setRedZoneRange(randomLimit);
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="phoneDashboard">
      <Link to={"/"}>
        <button className="backButton">{"<--"} Back to change device</button>
      </Link>
      <div className="panel">
        <AnalogGauge
          value={speed}
          max={140}
          label="km/h"
          steps={20}
          limit={speedLimit}
          redZoneStart={redZoneRange}
        />
        <AnalogGauge
          value={rpm / 1000}
          max={8}
          label="x1000 RPM"
          steps={1}
          redZoneStart={6.5}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Odometer value={mil || mileage} />
      </div>
      <h2 style={{ marginTop: "20px" }}>Gear: {data?.truck?.gear || "N"}</h2>
    </div>
  );
};
