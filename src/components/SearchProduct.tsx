import { useState } from "react";

type SearchProductProps = {
  placeholder: string;
  onSearch: (value: string) => void;
};

export function SearchProduct({ placeholder, onSearch }: SearchProductProps) {
  const [search, setSearch] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    onSearch(value.trim());
  };

  return (
    <div className="mx-2">
      <label htmlFor="input" className="h6">
        Name:
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleChange}
        style={{
          borderRadius: "5px",
          width: "auto",
          padding: "5px",
          marginLeft: "5px",
          border: "1px solid hsl(0, 0%, 80%)",
        }}
      />
    </div>
  );
}
