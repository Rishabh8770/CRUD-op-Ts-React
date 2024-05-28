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
        className="rounded w-auto p-2 mx-1 border border-gray-300"
      />
    </div>
  );
}
