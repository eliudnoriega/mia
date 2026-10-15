export interface Role {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
}

export interface RoleRequest {
  name: string;
  description: string;
}

export interface UserSummary {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  avatarUrl?: string;
}
