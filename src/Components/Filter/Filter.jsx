/* eslint-disable react/prop-types */

import { useState } from "react";
import styles from "./Filter.module.css";

const Filter = ({ apartments, onFilter, onReset }) => {
  const [dataFilter, setDataFilter] = useState({
    city: "",
    priceFrom: "",
    priceTo: "",
    areaFrom: "",
    areaTo: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDataFilter({
      ...dataFilter,
      [name]: value,
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filteredApartments = apartments.filter((apartment) => {
      const matchesCity =
        !dataFilter.city ||
        apartment.city.toLowerCase().includes(dataFilter.city.toLowerCase());
      
      const matchesPrice =
        (!dataFilter.priceFrom || apartment.rent >= parseFloat(dataFilter.priceFrom)) &&
        (!dataFilter.priceTo || apartment.rent <= parseFloat(dataFilter.priceTo));
      
      const matchesArea =
        (!dataFilter.areaFrom || apartment.area >= parseFloat(dataFilter.areaFrom)) &&
        (!dataFilter.areaTo || apartment.area <= parseFloat(dataFilter.areaTo));
      
      return matchesCity && matchesPrice && matchesArea;
    });
    onFilter(filteredApartments);
  };

  const handleFilterReset = () => {
    setDataFilter({
      city: "",
      priceFrom: "",
      priceTo: "",
      areaFrom: "",
      areaTo: "",
    });
    onReset();
  };

  return (
    <>
      <form className={styles.filters} onSubmit={handleFilterSubmit}>
        <div>
          <button type="submit" className={styles.btnFilter}>
            FILTER
          </button>
          <button
            type="button"
            className={styles.delFilter}
            onClick={handleFilterReset}
          >
            RESET
          </button>
        </div>
        <div>
          <div className={styles["city-name"]}>
            <input
              type="text"
              name="city"
              placeholder="City name"
              value={dataFilter.city || ""}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <input
              type="number"
              name="priceFrom"
              placeholder="Price From"
              value={dataFilter.priceFrom}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="priceTo"
              placeholder="Price To"
              value={dataFilter.priceTo}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <input
              type="number"
              name="areaFrom"
              placeholder="Area From"
              value={dataFilter.areaFrom}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="areaTo"
              placeholder="Area To"
              value={dataFilter.areaTo}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default Filter;
