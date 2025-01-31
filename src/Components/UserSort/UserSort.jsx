/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./UserSort.module.css";

const Sort = ({ onSort, onReset }) => {
  const [sortCriteria, setSortCriteria] = useState({
    key: "firstName",
    order: "asc",
  });

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setSortCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSort(sortCriteria);
  };

  const handleReset = () => {
    setSortCriteria({ key: "firstName", order: "asc" }); // Resetează criteriile de sortare
    onReset(); // Resetează lista sortată
  };

  return (
    <form className={styles.sort} onSubmit={handleSubmit}>
      <div className={styles.sortActions}>
        <button type="submit" className={styles["sort-up"]}>
          Sort
        </button>
        <button type="button" className={styles.delSort} onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className={styles.sortGroup}>
        <label>
          Sort By:{" "}
          <select
            name="key"
            value={sortCriteria.key}
            onChange={handleSortChange}
          >
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="flatsCount">Flats Count</option>
          </select>
        </label>
        <label>
          Order:{" "}
          <select
            name="order"
            value={sortCriteria.order}
            onChange={handleSortChange}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
    </form>
  );
};

export default Sort;
