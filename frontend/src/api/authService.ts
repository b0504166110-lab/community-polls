import api from "./client";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginData = {
  email: string;
  password: string;
};
export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export async function login(email: string, password: string) {
  const res = await api.post<AuthResponse>("/auth/login", { email, password });
  return res.data;
}
export async function register(name: string, email: string, password: string) {
  const res = await api.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  });
  return res.data;
}
export async function getMe() {
  const res = await api.get<User>("/auth/me");
  return res.data;
}
