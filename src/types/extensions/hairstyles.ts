export type Gender = "MALE" | "FEMALE";

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
