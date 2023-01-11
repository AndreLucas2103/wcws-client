import { Route, Routes } from 'react-router-dom';

import { useAppSelector } from 'utils/hooks/useRedux';
import { Login } from 'pages/Login';
import { Chat } from 'pages/Chat';

export const AppRoutes = () => {
    const chat = useAppSelector((redux) => redux.chat);

    const chatExist = <Route path="*" element={<Chat />} />;

    return <Routes>{chat ? chatExist : <Route path="*" element={<Login />} />}</Routes>;
};
