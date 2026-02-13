
export enum UserRole {
  PARTICIPANT = 'PARTICIPANT',
  AUDIENCE = 'AUDIENCE',
  ADMIN = 'ADMIN',
  NONE = 'NONE'
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
}

export interface AdminAccount {
  username: string;
  password: string;
}

export interface QuestionPoolItem {
  id: string;
  imageUrl: string;
  contributorId: string;
}

export interface Submission {
  id: string;
  participantId: string;
  roundId: string;
  imageUrl: string;
  timestamp: number;
  scores: Record<string, number>; 
}

export interface Round {
  id: string;
  roundNumber: number;
  topicImage: string; 
  isTopicRevealed: boolean;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  participantIds: string[];
}

export interface AppState {
  participants: Participant[];
  admins: AdminAccount[];
  questionPool: QuestionPoolItem[];
  rounds: Round[];
  submissions: Submission[];
}
