const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

let truckSimTelemetry;
try {
  truckSimTelemetry = require("trucksim-telemetry");
} catch (e) {
  truckSimTelemetry = null;
}

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = 3000;

let telemetry = null;
try {
  if (truckSimTelemetry) {
    telemetry = truckSimTelemetry();
  }
} catch (e) {
  console.log(
    "⚠️ Telemetry driver failed (Node version issue). Automatic Simulation ON."
  );
}

console.log("------------------------------------------------");
console.log("🚀 Server started on port " + PORT);
console.log(
  "   Mode: " +
    (telemetry ? "HYBRID (Game + Sim)" : "PURE SIMULATION (Portfolio Mode)")
);
console.log("   Waiting for client connection...");
console.log("------------------------------------------------");

let simSpeed = 0;
let simRpm = 600;
let simGear = 0;
let increasing = true;

io.on("connection", (socket) => {
  console.log("📱 Client connected: " + socket.id);
});

setInterval(() => {
  let payload;
  let gameData = null;

  if (telemetry) {
    try {
      gameData = telemetry.data;
    } catch (e) {}
  }

  if (gameData && gameData.game && gameData.game.sdkActive) {
    payload = {
      truck: {
        speed: Math.floor(gameData.truck.speed * 3.6),
        rpm: Math.floor(gameData.truck.engine.rpm),
        gear: gameData.truck.transmission.gear.displayed || "N",
        fuel: gameData.truck.fuel.value,
        source: "REAL_GAME",
      },
    };
  } else {
    if (increasing) {
      simSpeed += 0.4;
      simRpm += 60;
      
      if (simRpm > 2000 && simGear < 12){
        simRpm = 1100;
        simGear++;
      }

      if (simSpeed > 120) increasing = false;
    } else {
      simSpeed -= 0.6;
      simRpm -= 50;

      if (simRpm < 1000 && simGear > 1){
        simRpm = 1700
        simGear--;
      }

      if (simSpeed <= 0) {
        simSpeed = 0;
        simRpm = 600;
        simGear = 1;
        increasing = true;
      }
    }

    if (simRpm > 2500) simRpm = 1100;
    if (simRpm < 600) simRpm = 600;

    payload = {
      truck: {
        speed: Math.floor(simSpeed),
        rpm: Math.floor(simRpm),
        gear: "A" + simGear,
        fuel: 75,
        source: "SIMULATION",
      },
    };
  }

  io.emit("telemetry", payload);

  if (Math.random() > 0.9) {
    const src =
      payload.truck.source === "REAL_GAME" ? "🟢 LIVE" : "🟡 SIMULATION";
    console.log(
      `[${src}] Speed: ${payload.truck.speed} km/h | RPM: ${payload.truck.rpm} | Gear : ${payload.truck.gear}`
    );
  }
}, 100);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
