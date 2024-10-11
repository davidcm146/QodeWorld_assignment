export type Comment = {
    id: number;
    content: string;
    createdAt: string; 
  };
  
export type Photo = {
    id: number;
    url: string;
    createdAt: string; 
    comments: Comment[];
  };