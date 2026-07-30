export interface Store {
  id: number;
  name: string;
  // add any other real fields once you share a sample response
}

export interface StoreListResponse {
  success: boolean;
  status: number;
  message: string;
  data: Store[];
}
