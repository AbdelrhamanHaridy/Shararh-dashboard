export interface FollowUpEmployee {
  id: number;
  name: string;
}

export interface FollowUpEmployeesResponse {
  status: boolean;
  message: string;
  data: {
    employees: FollowUpEmployee[];
  };
}
