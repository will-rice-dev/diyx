export interface CreatePortfolioRequest {
  name: string;
  stocks: Record<string, number>;
}

export interface UpdatePortfolioRequest {
  name: string;
  stocks: Record<string, number>;
}

export interface PortfolioResponse {
  id: number;
  name: string;
  stocks: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}
