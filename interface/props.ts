import { Post } from "./post";
export interface BurguerMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  posts: Post[];
  children: React.ReactNode;
  id: number;
}
export interface MainContentProps {
  sanitizedHTML: string;
  title: string;
}
