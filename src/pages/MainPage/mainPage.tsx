import { Link } from "react-router-dom";
import "./mainPge.css";

export const MainPage = () => {
  return (
    <div className="mainDiv">
      <h1 className="header">Choose your device</h1>
      <h2 className="text">Select a device to view its telemetry data:</h2>
      <div className="devicesContainer">
        <Link to="/phone">
          <div className="divForPhone">
            <h2 className="text">Phone (speed, rpm, fuel, gear)</h2>
          </div>
        </Link>
        <Link to="/tablet">
          <div className="divForTablet">
            <h2 className="text">Tablet (button panel and map)</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};
