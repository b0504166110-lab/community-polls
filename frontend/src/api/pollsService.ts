import api from "./client";
export type Poll = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  categoryLabel: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  isOpen: boolean;
  voterCount: number;
  hasVoted: boolean;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canClose: boolean;
  };
};
export type PollsResponse = {
  items: Poll[];
  page: number;
  totalPages: number;
};
export type PollOption = {
  id: number;
  text: string;
  position: number;
};
export type PollQuestion = {
  id: number;
  text: string;
  allowMultiple: boolean;
  position: number;
  options: PollOption[];
};
export type PollDetails = Poll & {
  closesAt: string;
  questions: PollQuestion[];
  myChoices: number[];
  permissions: {
    canVote: boolean;
    canSeeResults: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canClose: boolean;
  };
};
export type PollResults = {
  totalVoters: number;
  questions: {
    id: number;
    text: string;
    allowMultiple: boolean;
    totalChoices: number;
    options: {
      id: number;
      text: string;
      count: number;
      percent: number;
    }[];
  }[];
  myChoices: number[];
};
export type Category = {
  value: string;
  label: string;
};
export type PollsFilters = {
  search?: string;
  category?: string;
  state?: string;
  sort?: string;
  page?: number;
  mine?: boolean;
};
export type QuestionInput = {
  text: string;
  allowMultiple?: boolean;
  options: string[];
};
export type PollInput = {
  title: string;
  description?: string | null;
  category: string;
  closesAt: string;
  questions: QuestionInput[];
};
export async function createPoll(poll: PollInput) {
  const res = await api.post<PollDetails>("/polls", poll);
  return res.data;
}
export async function updatePoll(id: number, poll: PollInput) {
  const res = await api.put<PollDetails>(`/polls/${id}`, poll);
  return res.data;
}
export async function getPolls(filters: PollsFilters) {
  const res = await api.get<PollsResponse>("/polls", { params: filters });
  return res.data;
}
export async function deletePoll(id: number) {
  await api.delete(`/polls/${id}`);
}
export async function closePoll(id: number) {
  const res = await api.post<PollDetails>(`/polls/${id}/close`);
  return res.data;
}
export async function getCategories() {
  const res = await api.get<Category[]>("/categories");
  return res.data;
}
export async function getPoll(id: number) {
  const res = await api.get<PollDetails>(`/polls/${id}`);
  return res.data;
}
export async function vote(id: number, optionIds: number[]) {
  const res = await api.post<PollDetails>(`/polls/${id}/votes`, { optionIds });
  return res.data;
}
export async function getResults(id: number) {
  const res = await api.get<PollResults>(`/polls/${id}/results`);
  return res.data;
}
