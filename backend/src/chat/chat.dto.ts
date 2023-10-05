
export interface Participant {
  userId: number;
  username: string;
  avatar: string;
  status: string,
}

export interface MessageEvent {
  socketId: string;
  roomId: string;
  user: Participant;
  content: string;
  createdAt: Date;
}

