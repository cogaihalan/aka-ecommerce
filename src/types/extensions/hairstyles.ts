export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface HairstylePhoto {
  id: number;
  url: string;
  primary: boolean;
}

export interface Hairstyle {
  id: number;
  name: string;
  barberName: string;
  gender: Gender;
  voteCount: number;
  photos: HairstylePhoto[];
  liked: boolean;
}

export interface CreateHairstyleRequest {
  name: string;
  barberName: string;
  gender: Gender;
  photos: Omit<HairstylePhoto, 'id'>[];
}

export interface UpdateHairstyleRequest extends Partial<CreateHairstyleRequest> {
  id?: number;
}

export interface VoteHairstyleRequest {
  hairstyleId: number;
  liked: boolean;
}
