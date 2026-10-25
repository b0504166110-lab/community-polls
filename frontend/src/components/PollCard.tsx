import { useNavigate } from "react-router-dom";
import type { Poll } from "../api/pollsService";
import type{ ReactNode } from "react";

function PollCard({ children,poll }:{children?:ReactNode,poll: Poll }) {
  const navigate = useNavigate();

  return (
    <li>
      <h3>{poll.title}</h3>
      <p>{poll.description}</p>
      <p>
        {poll.categoryLabel} · {poll.voterCount} מצביעים ·{" "}
        {poll.isOpen ? "פתוח" : "סגור"}
        {poll.hasVoted && " · הצבעת"}
      </p>
      <button onClick={() => navigate(`/polls/${poll.id}`)}>לסקר</button>
      {children}
    </li>
  );
}

export default PollCard;
