/* eslint-disable react/prop-types */

import { useState } from "react";
import styles from "./Sort.module.css";
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

const Sort = ({ apartments, onSort }) => {
  const [dataSort, setDataSort] = useState({ sortBy: '', direction: '' });

  const handleSortChange = (e) => {
    setDataSort({ ...dataSort, sortBy: e.target.value });
  };

  const handleSortUp = () => {
    if (!apartments || apartments.length === 0) return;
  
    const sortedApartments = [...apartments].sort((a, b) => {
      const aValue = a[dataSort.sortBy];
      const bValue = b[dataSort.sortBy];
  console.log(apartments);
      if (dataSort.sortBy === 'city') {
        return aValue.localeCompare(bValue);
      } else if (dataSort.sortBy === 'rent' || dataSort.sortBy === 'area') {
        return +(aValue) - (+bValue);
      }
      return 0; 
    });
    onSort(sortedApartments);
  };

  const handleSortDown = () => {
    if (!apartments || apartments.length === 0) return;
  
    const sortedApartments = [...apartments].sort((a, b) => {
      const aValue = a[dataSort.sortBy];
      const bValue = b[dataSort.sortBy];
  
      if (dataSort.sortBy === 'city') {
        return bValue.localeCompare(aValue);
      } else if (dataSort.sortBy === 'rent' || dataSort.sortBy === 'area' ) {
        return (+bValue) - (+aValue);
      }
      return 0;
    });
    onSort(sortedApartments);
  };

  const handleReset = () => {
    onSort(apartments); // Reset to original apartments
    setDataSort()
  };

  return (
    <div className={styles.sort}>
      <div>
        <button type="button" className={styles["sort-up"]} onClick={handleSortUp}>
          SORT <IoIosArrowUp />
        </button>
        <button type="button" className={styles["sort-down"]} onClick={handleSortDown}>
          SORT <IoIosArrowDown />
        </button>
        <button type="button" className={styles.delSort} onClick={handleReset}>
          RESET
        </button>
      </div>
      <div className={styles["radio-button"]}>
        <div>
          <label htmlFor="sort-city">City </label>
          <input
            type="radio"
            name="sort"
            value="city"
            id="sort-city"
            onChange={handleSortChange}
          />
        </div>
        <div>
          <label htmlFor="sort-price">Price</label>
          <input
            type="radio"
            name="sort"
            value="rent"
            id="sort-price"
            onChange={handleSortChange}
          />
        </div>
        <div>
          <label htmlFor="sort-area">Area</label>
          <input
            type="radio"
            name="sort"
            value="area"
            id="sort-area"
            onChange={handleSortChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Sort;