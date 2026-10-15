import { Company, Project } from './project.model';

export interface UserDetail {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  projectIds?: string[];
  projects?: Project[];
  company?: Company | null;
  avatarUrl?: string;
  createdAt?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  roles?: string[];
  projectIds?: string[];
  companyId?: number | null;
}

export interface UpdateUserData {
  fullName: string;
  email: string;
  companyId: number | null;
  roles: string[];
  projectIds?: string[];
}
