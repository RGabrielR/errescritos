export interface Post {
  id?: number;
  title: string;
  body: string; // JSON strings are sent as plain text
  image: string; // Buffer would be base64 encoded
  launchDate: string; // ISO date string
}

export interface Data {
  success: boolean;
  post?: Post & { id: number };
  posts?: (Post & { id: number })[];
  message?: string;
}
