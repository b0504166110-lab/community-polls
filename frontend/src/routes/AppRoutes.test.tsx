import { describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { setUser } from "../store/authSlice";
import { regularUser, renderWithProviders } from "../test/render";

vi.mock("../pages/PollDetails", () => ({
  default: function PollDetailsStub() {
    const { pathname, search } = useLocation();
    return <p>{`סקר: ${pathname}${search}`}</p>;
  },
}));

describe("חזרה לעמוד המקורי אחרי התחברות", () => {
  it("אורח שהופנה להתחברות חוזר לסקר, כולל מחרוזת השאילתה", () => {
    const { store } = renderWithProviders(<AppRoutes />, {
      route: "/polls/5?tab=1",
    });
    expect(screen.queryByText(/סקר:/)).not.toBeInTheDocument();

    act(() => {
      store.dispatch(setUser(regularUser));
    });

    expect(screen.getByText("סקר: /polls/5?tab=1")).toBeInTheDocument();
  });

  it("כניסה ישירה להתחברות מובילה אחרי הכניסה לרשימת הסקרים", () => {
    const { store } = renderWithProviders(<AppRoutes />, { route: "/login" });

    act(() => {
      store.dispatch(setUser(regularUser));
    });

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByText(/סקר:/)).not.toBeInTheDocument();
  });
});
