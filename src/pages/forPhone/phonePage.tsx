import "./phoneStyles.css"
import { useTelemetry } from "../../hooks/useTelemetry";
import {AnalogGauge} from "../../components/AnalogGauge/AnalogGauge";

export const PhonePage = () => {
    const data = useTelemetry();
    const speed = Math.floor(data?.truck?.speed || 0)

    return (
        <div className="phoneDashboard">
            <AnalogGauge value={speed} max={140} label="km/h" steps={20}/>
            <h2 style={{marginTop : '20px'}}>Gear: {data?.truck?.gear || 'N'}</h2>
        </div>
    )
}