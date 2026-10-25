import { useState } from "react";

function SearchBox({ onSearch }: { onSearch: (text: string) => void }) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    onSearch(text.trim());
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="חיפוש..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">חיפוש</button>
    </form>
  );
}

export default SearchBox;
