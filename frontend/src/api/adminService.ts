import api from "./client";
import type { Poll, PollDetails } from "./pollsService";
export type AdminPoll = Poll & {
  isHidden: boolean;
  creator: {
    id: number;
    name: string;
    email: string;
  };
  closedEarlyAt: string | null;
};
export type AdminPollsResponse = {
  items: AdminPoll[];
  page: number;
  totalPages: number;
};
export type AdminPollsFilters = {
  status?: "APPROVED"|"REJECTED"|"PENDING";
  hidden?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};
export async function getAdminPolls(filters: AdminPollsFilters) {
  const res = await api.get<AdminPollsResponse>("/admin/polls", {
    params: filters,
  });
  return res.data;
}
export async function approvePoll (id: number) {
  const res = await api.post<PollDetails>(`/admin/polls/${id}/approve`);
  return res.data;
}
export async function rejectPoll(id: number, reason: string) {
  const res = await api.post<PollDetails>(`/admin/polls/${id}/reject`, { reason });
  return res.data;
}
export async function setPollHidden  (id: number,isHidden:boolean) {
  const res = await api.patch<PollDetails>(`/admin/polls/${id}/visibility`,{isHidden});
  return res.data;
}

