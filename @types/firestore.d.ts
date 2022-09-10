type HydratedChatMessage = Overwrite<Omit<ChatMessage, 'timestamp'>, {
  dateTime: dayjs.Dayjs,
  id: string,
}>;

type ChatMessage = {
  content?: string,
  image?: string,
  timestamp: firebase.default.firestore.Timestamp,
  userId: number,
};
