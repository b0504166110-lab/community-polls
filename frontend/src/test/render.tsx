import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import authReducer, { setUser } from "../store/authSlice";
import type { User } from "../api/authService";

export const regularUser: User = {
  id: 1,
  name: "משתמשת",
  email: "user@example.com",
  role: "USER",
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const adminUser: User = {
  ...regularUser,
  id: 2,
  name: "מנהלת",
  role: "ADMIN",
};

export function renderWithProviders(
  ui: ReactElement,
  { user = null, route = "/" }: { user?: User | null; route?: string } = {},
) {
  const store = configureStore({ reducer: { auth: authReducer } });
  if (user) store.dispatch(setUser(user));
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidate = vi.spyOn(queryClient, "invalidateQueries");
  const result = render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  );
  return { ...result, store, queryClient, invalidate };
}
