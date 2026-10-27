import { describe, expect, it } from "vitest";
import { Route, Routes, Link } from "react-router-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BackButton from "./BackButton";
import { renderWithProviders } from "../test/render";

function setup(route: string) {
  return renderWithProviders(
    <>
      <BackButton />
      <Routes>
        <Route path="/" element={<Link to="/other">לעמוד אחר</Link>} />
        <Route path="/other" element={<p>עמוד אחר</p>} />
      </Routes>
    </>,
    { route },
  );
}

describe("BackButton", () => {
  it("לא מוצג בדף הבית", () => {
    setup("/");
    expect(
      screen.queryByRole("button", { name: /חזרה/ }),
    ).not.toBeInTheDocument();
  });

  it("מוצג בעמוד אחר", () => {
    setup("/other");
    expect(screen.getByRole("button", { name: /חזרה/ })).toBeInTheDocument();
  });

  it("לחיצה אחרי ניווט מחזירה לעמוד הקודם", async () => {
    setup("/");
    await userEvent.click(screen.getByText("לעמוד אחר"));
    expect(screen.getByText("עמוד אחר")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /חזרה/ }));
    expect(screen.getByText("לעמוד אחר")).toBeInTheDocument();
  });
});
