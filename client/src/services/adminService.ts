import { api } from './api';
import type { User } from '../types/auth';
import type { Deal } from './dealService';

export const fetchUsers = async () => {
  const res = await api.get<{ users: User[] }>('/admin/users');
  return res.data.users;
};

export const banUser = async (id: string) => {
  const res = await api.patch(`/admin/users/${id}/ban`);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const fetchMerchants = async () => {
  const res = await api.get<{ merchants: User[] }>('/admin/merchants');
  return res.data.merchants;
};

export const banMerchant = async (id: string) => {
  const res = await api.patch(`/admin/merchants/${id}/ban`);
  return res.data;
};

export const deleteMerchant = async (id: string) => {
  const res = await api.delete(`/admin/merchants/${id}`);
  return res.data;
};

export const fetchDeals = async () => {
  const res = await api.get<{ deals: Deal[] }>('/admin/deals');
  return res.data.deals;
};

export const moderateDeal = async (id: string, status: string) => {
  const res = await api.patch(`/admin/deals/${id}/moderate`, { status });
  return res.data;
};

export const deleteDeal = async (id: string) => {
  const res = await api.delete(`/admin/deals/${id}`);
  return res.data;
};

export default {
  fetchUsers,
  banUser,
  deleteUser,
  fetchMerchants,
  banMerchant,
  deleteMerchant,
  fetchDeals,
  moderateDeal,
  deleteDeal,
};
