/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./UserFilter.module.css";

const Filter = ({ onFilter, onReset }) => {
  const [criteria, setCriteria] = useState({
    isAdmin: null,
    ageRange: { min: null, max: null },
    flatsRange: { min: null, max: null },
  });

  const handleRangeChange = (e, rangeKey) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [rangeKey]: {
        ...prev[rangeKey],
        [name]: value ? parseInt(value, 10) : null,
      },
    }));
  };

  const handleAdminChange = (e) => {
    const value = e.target.value;
    setCriteria((prev) => ({
      ...prev,
      isAdmin: value === "true" ? true : value === "false" ? false : null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(criteria); // Trimite criteriile de filtrare
  };

  const handleReset = () => {
    setCriteria({
      isAdmin: null,
      ageRange: { min: null, max: null },
      flatsRange: { min: null, max: null },
    });
    onReset(); // Resetează filtrele în componenta părinte
  };

  return (
    <form className={styles.filters} onSubmit={handleSubmit}>
      <div>
        <button type="submit" className={styles.btnFilter}>
          Filter
        </button>
        <button
          type="button"
          onClick={handleReset}
          className={styles.delFilter}
        >
          Reset
        </button>
      </div>
      <div className={styles.filterGroup}>
        <label>
          Is Admin:{" "}
          <select
            name="isAdmin"
            value={criteria.isAdmin ?? ""}
            onChange={handleAdminChange}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
        <div>
          <label>
            Age Range:{" "}
            <input
              type="number"
              name="min"
              placeholder="Minimum"
              value={criteria.ageRange.min ?? ""}
              onChange={(e) => handleRangeChange(e, "ageRange")}
            />
            <input
              type="number"
              name="max"
              placeholder="Maximum"
              value={criteria.ageRange.max ?? ""}
              onChange={(e) => handleRangeChange(e, "ageRange")}
            />
          </label>
        </div>
        <div>
          <label>
            Flats Range:{" "}
            <input
              type="number"
              name="min"
              placeholder="Minimum"
              value={criteria.flatsRange.min ?? ""}
              onChange={(e) => handleRangeChange(e, "flatsRange")}
            />
            <input
              type="number"
              name="max"
              placeholder="Maximum"
              value={criteria.flatsRange.max ?? ""}
              onChange={(e) => handleRangeChange(e, "flatsRange")}
            />
          </label>
        </div>
      </div>
    </form>
  );
};

export default Filter;
