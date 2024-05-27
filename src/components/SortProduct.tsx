import React, { useState } from "react";

export type SortOptions = "--please select--" | "name" | "business" | "regions";

type SortProductProps = {
  onProductSort: (filter: SortOptions) => void;
};

export const SortProduct = ({ onProductSort }: SortProductProps) => {
  const [sortOption, setSortOption] =
    useState<SortOptions>("--please select--");

  const handleProductSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortOption = event.target.value as SortOptions;
    setSortOption(selectedSortOption);
    onProductSort(selectedSortOption);
  };

  return (
    <div>
      <label htmlFor="filter" className="mx-2 h6">
        Sort By:{" "}
      </label>
      <select
        name="filter"
        value={sortOption}
        onChange={handleProductSort}
        className="rounded p-2 border border-gray-300"
      >
        <option value="">-Please select-</option>
        <option value="name">Name</option>
        <option value="business">Business</option>
        <option value="regions">Regions</option>
      </select>
    </div>
  );
};
