import { describe, expect, it } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Landing from "./Landing";
import type { User } from "../api/authService";
import { regularUser, renderWithProviders } from "../test/render";

function setup(user: User | null) {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/polls" element={<p>רשימת הסקרים</p>} />
      <Route path="/register" element={<p>דף הרשמה</p>} />
    </Routes>,
    { user },
  );
}

describe("Landing", () => {
  it("אורח רואה כפתור צפייה בסקרים וכפתור הצטרפות", () => {
    setup(null);
    expect(
      screen.getByRole("button", { name: "לצפייה בסקרים" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "הצטרפות" })).toBeInTheDocument();
  });

  it("משתמשת מחוברת לא רואה כפתור הצטרפות", () => {
    setup(regularUser);
    expect(
      screen.queryByRole("button", { name: "הצטרפות" }),
    ).not.toBeInTheDocument();
  });

  it("לחיצה על צפייה בסקרים מעבירה לרשימה", async () => {
    setup(null);
    await userEvent.click(
      screen.getByRole("button", { name: "לצפייה בסקרים" }),
    );
    expect(screen.getByText("רשימת הסקרים")).toBeInTheDocument();
  });

  it("לחיצה על הצטרפות מעבירה להרשמה", async () => {
    setup(null);
    await userEvent.click(screen.getByRole("button", { name: "הצטרפות" }));
    expect(screen.getByText("דף הרשמה")).toBeInTheDocument();
  });
});
