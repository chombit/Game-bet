import { createBrowserRouter } from 'react-router';
import { LoginScreen } from './screens/login-screen';
import { GameLobby } from './screens/game-lobby';
import { CrashGame } from './screens/crash-game';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginScreen,
  },
  {
    path: '/lobby',
    Component: GameLobby,
  },
  {
    path: '/game/aviator',
    Component: () => <CrashGame gameType="aviator" />,
  },
  {
    path: '/game/jetx',
    Component: () => <CrashGame gameType="jetx" />,
  },
  {
    path: '/game/rocket',
    Component: () => <CrashGame gameType="rocket" />,
  },
]);
