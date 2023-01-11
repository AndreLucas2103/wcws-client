import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AvisoProvider } from './utils/providers/AvisoProvider';

export const App = () => {
    return (
        <AvisoProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AvisoProvider>
    );
};
/* 
import { io } from 'socket.io-client';
import { useEffect } from 'react';

const TesteCarga = () => {
    const URL = 'http://localhost:3030';
    const MAX_CLIENTS = 250;
    const CLIENT_CREATION_INTERVAL_IN_MS = 10;
    const EMIT_INTERVAL_IN_MS = 1000;

    let clientCount = 0;
    let lastReport = new Date().getTime();
    let packetsSinceLastReport = 0;

    const createClient = () => {
        const socket = io(URL, {
            transports: ['websocket'],
        });

        setInterval(() => {
            socket.emit('client-server');
        }, EMIT_INTERVAL_IN_MS);

        socket.on('server to client event', () => {
            packetsSinceLastReport++;
        });

        socket.on('disconnect', (reason: string) => {
            console.log(`disconnect due to ${reason}`);
        });

        if (++clientCount < MAX_CLIENTS) {
            setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
        }
    };

    const printReport = () => {
        const now = new Date().getTime();
        const durationSinceLastReport = (now - lastReport) / 1000;
        const packetsPerSeconds = (packetsSinceLastReport / durationSinceLastReport).toFixed(2);

        console.log(`client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`);

        packetsSinceLastReport = 0;
        lastReport = now;
    };

    useEffect(() => {
        createClient();
        setInterval(printReport, 5000);
    }, []);

    return null;
};
 */
