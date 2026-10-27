import { useLocation, useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  function goBack() {
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
