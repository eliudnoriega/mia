export type ProjectCategory = 
  | 'todos'
  | 'corporativo'
  | 'web' 
  | 'api' 
  | 'rrhh' 
  | 'operaciones' 
  | 'finanzas' 
  | 'soporte' 
  | 'seguridad';

export type ProjectEnvironment = 'PROD' | 'STAGE' | 'DEV';

export type ProjectStatus = 'active' | 'maintenance' | 'offline';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProjectCategory;
  categoryLabel: string;
  icon: string;
  iconBgColor?: string;
  url: string;
  isFavorite: boolean;
  favorite?: boolean;
  status: ProjectStatus;
  environment: ProjectEnvironment;
  version: string;
  team: string;
  uptime: string;
  lastDeploy: string;
  accessCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: number;
  name: string;
  taxId?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFilter {
  searchTerm: string;
  category: ProjectCategory;
  environment: 'ALL' | ProjectEnvironment;
  onlyFavorites: boolean;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'popular' | 'recent';
}
