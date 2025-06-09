import { api } from './api';

export interface Deal {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  terms?: string;
  expiry?: string;
  status: string;
  merchant: { businessName: string } | string;
  createdAt: string;
  image: string;
  claimedCount?: number;
  favoriteCount?: number;
}

export interface DealResponse {
  deals: Deal[];
}

export const fetchDeals = async (category?: string, search?: string): Promise<Deal[]> => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (category) params.category = category;
  const res = await api.get<DealResponse>('/deals', { params });
  return res.data.deals;
};

export const getDealById = async (id: string): Promise<Deal> => {
  const res = await api.get<{ deal: Deal }>(`/deals/${id}`);
  return res.data.deal;
};

export const claimDeal = async (id: string): Promise<void> => {
  await api.post(`/deals/${id}/claim`);
};

export const favoriteDeal = async (id: string): Promise<void> => {
  await api.post(`/deals/${id}/favorite`);
};

const dealService = {
  fetchDeals,
  getDealById,
  claimDeal,
  favoriteDeal,
};

export default dealService;
