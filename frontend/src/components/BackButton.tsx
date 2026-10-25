import { useLocation, useNavigate } from "react-router-dom";

// כפתור "חזרה" שמופיע בכל עמוד חוץ מדף הבית
function BackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  function goBack() {
    // react-router שומר ב-history.state את המיקום בהיסטוריה (idx). אם הוא 0, נכנסו ישר לעמוד
    // הזה (למשל מקישור) ואין לאן לחזור בדפדפן, אז מעבירים לדף הבית
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/");
  }

  return (
    <button type="button" className="back" onClick={goBack}>
      → חזרה
    </button>
  );
}

export default BackButton;
