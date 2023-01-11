import { PropsWithChildren, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

export const socket = socketIOClient('http://localhost:3030', {
    autoConnect: true,
    transports: ['websocket'],
    auth: {
        token: null,
    },
});

export const SocketIoProvider = ({ children }: { children: PropsWithChildren }) => {
    useEffect(() => {
        socket.on('connect', () => {});

        socket.on('disconnect', (reason) => {
            console.log(reason);
        });

        socket.on('exception', (data) => console.log(data));

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('exception');
        };
    }, []);

    return <>{children}</>;
};
