import { describe, expect, it } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import AppRoutes from "../routes/AppRoutes";
import NotFound from "./NotFound";
import { renderWithProviders } from "../test/render";

describe("NotFound", () => {
  it("מציג הודעה וקישור חזרה לרשימת הסקרים", () => {
    renderWithProviders(
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>,
    );
    expect(screen.getByText("העמוד לא נמצא")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "חזרה לרשימת הסקרים" }),
    ).toHaveAttribute("href", "/polls");
  });

  it("כתובת שלא קיימת בנתיבי האתר מובילה אליו", () => {
    renderWithProviders(<AppRoutes />, { route: "/no-such-page" });
    expect(screen.getByText("העמוד לא נמצא")).toBeInTheDocument();
  });
});
