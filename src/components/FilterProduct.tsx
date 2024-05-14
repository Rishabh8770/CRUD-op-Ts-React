import React, { useState } from 'react';

export type FilterOptions = "--please select--"|"name"|"business"|"regions";

type FilterProductProps = {
    onFilterChange:(filter: FilterOptions) => void;
}

export const FilterProduct = ({onFilterChange}: FilterProductProps) => {
  const [filter, setFilter] = useState<FilterOptions>('--please select--');

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value as FilterOptions;
    setFilter(selectedFilter);
    onFilterChange(selectedFilter)
  }

  

  return (
    <div className='d-flex align-items-center'>
      <label htmlFor="filter" className='mx-2 h6'>Sort By: </label>
      <select
        name="filter"
        value={filter}
        onChange={handleFilterChange}
        style={{borderRadius:"5px", height:'35px', width:'60%'}}
      >
        <option value="">-Please select-</option>
        <option value="name">Name</option>
        <option value="business">Business</option>
        <option value="regions">Regions</option>
      </select>
    </div>
  )
};
