import React from 'react';
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import { Room } from './pages/VideoCall';

const routes = [
  {
    path: "/",
    element: <ChatPage/>
  },
  {
    path: "/auth/*",
    element: <AuthPage />
  },
  {
    path:"/videocall/*",
    element: <Room />
  }
];

export default routes;