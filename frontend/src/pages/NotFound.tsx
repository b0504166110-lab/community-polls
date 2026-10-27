import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found">
      <p className="not-found-code" dir="ltr" aria-hidden>
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </p>
      <h2>העמוד לא נמצא</h2>
      <p>הכתובת שחיפשתם לא קיימת או שהוסרה.</p>
      <Link className="not-found-link" to="/polls">
        חזרה לרשימת הסקרים
      </Link>
    </section>
  );
}

export default NotFound;
