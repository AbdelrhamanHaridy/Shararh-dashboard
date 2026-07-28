export interface RolesListResponse {
  success: boolean;
  status: number;
  message: string;
  data: Role[][];
}

export interface Role {
  id: number;
  name: string;
}
