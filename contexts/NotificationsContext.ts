import React, { createContext } from 'react';

type Value = {
  canLoadMore: boolean,
  isMenuOpen: boolean,
  loadMore: () => void,
  markAllAsRead: () => void,
  markAsRead: (notificationId: string) => Promise<void>,
  notifications: HydratedNotification[] | null,
  setIsMenuOpen: React.Dispatch<React.SetStateAction<Value['isMenuOpen']>>,
};

const NotificationsContext = createContext({} as Value);

export default NotificationsContext;
