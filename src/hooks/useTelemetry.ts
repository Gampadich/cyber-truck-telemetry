import { useState, useEffect } from "react";
import io from 'socket.io-client'

export interface TruckData {
    connected : boolean;
    game : string;
    truck : {
        speed : number;
        rpm : number;
        gear : string | number;
        fuel : number;
    }
}

const initialData : TruckData = {
    connected : false,
    game : 'offline',
    truck : { speed: 0, rpm : 0, gear: 'N', fuel: 0 }
}

export const useTelemetry = () => {
    const [data, setData] = useState<TruckData>(initialData)

    useEffect(() => {
        const socket = io('http://192.168.3.3:3000');

        socket.on('telemetry', (incomingData : TruckData) => {
            setData(incomingData)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    return data
}