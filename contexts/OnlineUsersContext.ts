import { createContext } from 'react';

type UserGame = {
  game: number,
  platform: number,
};

export type OnlineUser = {
  userGames: UserGame[],
  userId: number,
};

export type Value = {
  onlineUsers: OnlineUser[],
};

const OnlineUsersContext = createContext({} as Value);

export default OnlineUsersContext;
