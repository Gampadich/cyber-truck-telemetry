import "./phoneStyles.css"
import { useTelemetry } from "../../hooks/useTelemetry";
import {AnalogGauge} from "../../components/AnalogGauge/AnalogGauge";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const PhonePage = () => {
    const data = useTelemetry();
    const speed = Math.floor(data?.truck?.speed || 0)
    const rpm = Math.floor(data?.truck?.rpm || 0)
    const [speedLimit, setSpeedLimit] = useState<number>()
    const [redZoneRange, setRedZoneRange] = useState<number>()

    useEffect(() => {
        const limits = [50, 80, 90]

        const interval = setInterval(() => {
            const randomLimit = limits[Math.floor(Math.random() * limits.length)]
            setSpeedLimit(randomLimit)
            setRedZoneRange(randomLimit)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="phoneDashboard">
            <Link to={'/'}><button className="backButton">{'<--'} Back to change device</button></Link>
            <div className="panel">
                <AnalogGauge value={speed} max={140} label="km/h" steps={20} limit={speedLimit} redZoneStart={redZoneRange}/>
                <AnalogGauge value={rpm / 1000} max={8} label="x1000 RPM" steps={1} redZoneStart={6.5}/>
            </div>
            <h2 style={{marginTop : '20px'}}>Gear: {data?.truck?.gear || 'N'}</h2>
        </div>
    )
}