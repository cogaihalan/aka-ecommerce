export interface SubmissionPhoto {
  id: number;
  url: string;
  primary: boolean;
}

export interface SubmissionUser {
  id: number;
  username: string;
  clerkId: string;
}

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Submission {
  id: number;
  name: string;
  barberName: string;
  barberAddress: string;
  voteCount: number;
  status: SubmissionStatus;
  reason: string;
  photos: SubmissionPhoto[];
  user: SubmissionUser;
}
