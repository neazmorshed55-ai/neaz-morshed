
export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface Experience {
  id: number;
  year: string;
  company: string;
  role: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number;
}
