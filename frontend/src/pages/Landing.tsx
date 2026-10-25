import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/store";

// פלחי הדונאט המקושט: אחוז מהעיגול, וצבע מפלטת האתר. אין כאן נתונים אמיתיים, זה רק איור
const SEGMENTS = [
  { percent: 40, color: "var(--violet)" },
  { percent: 25, color: "var(--pink)" },
  { percent: 20, color: "var(--orange)" },
  { percent: 15, color: "var(--teal)" },
];

function Landing() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  // כניסה לאתר: הדף הבא נחשף בתוך עיגול שמתרחב מהכפתור שנלחץ.
  // בדפדפן בלי View Transitions, או למי שביקש פחות תנועה, פשוט עוברים דף
  function enter(e: React.MouseEvent<HTMLButtonElement>, path: string) {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      navigate(path);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // רדיוס שמגיע עד הפינה הרחוקה ביותר, כדי שהעיגול יכסה את כל המסך
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => navigate(path));
    });
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 900, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  // כל פלח מתחיל איפה שהקודם נגמר: ההסטה שווה לסכום הפלחים שלפניו
  const segments = SEGMENTS.map((s, i) => ({
    ...s,
    start: SEGMENTS.slice(0, i).reduce((sum, prev) => sum + prev.percent, 0),
  }));

  return (
    <section className="hero">
      <div>
        <h2>הקול שלך קובע</h2>
        <p>
          פותחים סקר, הקהילה מצביעה, והתוצאות מתחלקות לדיאגרמה צבעונית. הכול
          במקום אחד, ובזמן אמת.
        </p>
        <div className="hero-actions">
          <button onClick={(e) => enter(e, "/polls")}>לצפייה בסקרים</button>
          {!user && (
            <button className="secondary" onClick={(e) => enter(e, "/register")}>
              הצטרפות
            </button>
          )}
        </div>
      </div>

      <div className="hero-art" aria-hidden>
        <svg viewBox="0 0 200 200" width="100%">
          {/* pathLength=100 מאפשר לכתוב את אורך הפלח באחוזים */}
          {segments.map((s) => (
            <circle
              key={s.color}
              cx="100"
              cy="100"
              r="70"
              pathLength={100}
              strokeDasharray={`${s.percent - 1.5} ${100 - s.percent + 1.5}`}
              strokeDashoffset={-s.start}
              style={{ stroke: s.color }}
            />
          ))}
        </svg>
        {/* תג V, עמודות, קלפי הצבעה ופלח עוגה: איורים קטנים שצפים סביב הדונאט */}
        <span className="float f1">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="var(--teal)" />
            <path
              d="M14 25l7 7 13-15"
              fill="none"
              stroke="#fff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="float f2">
          <svg viewBox="0 0 48 48">
            <rect width="48" height="48" rx="12" fill="#fff" />
            <rect x="9" y="22" width="8" height="16" rx="3" fill="var(--violet)" />
            <rect x="20" y="12" width="8" height="26" rx="3" fill="var(--pink)" />
            <rect x="31" y="18" width="8" height="20" rx="3" fill="var(--orange)" />
          </svg>
        </span>
        <span className="float f3">
          <svg viewBox="0 0 48 48">
            <rect x="15" y="4" width="18" height="24" rx="3" fill="#fff" stroke="var(--brand)" strokeWidth="2.5" />
            <path
              d="M19.5 14l3 3 6-6.5"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="5" y="24" width="38" height="20" rx="6" fill="var(--brand)" />
            <rect x="14" y="28" width="20" height="4" rx="2" fill="#fff" opacity="0.35" />
          </svg>
        </span>
        <span className="float f4">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="var(--orange)" />
            <path d="M24 24V4a20 20 0 0 1 20 20z" fill="var(--pink)" />
          </svg>
        </span>
      </div>
    </section>
  );
}

export default Landing;
