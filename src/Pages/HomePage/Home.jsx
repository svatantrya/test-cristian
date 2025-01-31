import { useEffect } from "react";
import Card from "../../Components/Card/Card";
import DisplayAmountOfApartments from "../../Components/DisplayAmountOfApartments/DisplayAmountOfApartments";
import Sort from "../../Components/Sort/Sort";
import Filter from "../../Components/Filter/Filter";
import styles from "./Home.module.css";
import { useApartments } from "../../utilFunctions";
import useAuth from "../../Contexts/UseAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const {
    apartments,
    setApartments,
    filtered,
    sorted,
    isLoading,
    error,
    fetchAllApartments,
    setFilteredApartments,
    setSortedApartments,
  } = useApartments();

  useEffect(() => {
    const unsubscribe = fetchAllApartments();
    return () => unsubscribe;
  }, [fetchAllApartments]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  const displayedApartments = (sorted || filtered) ? (Array.isArray(sorted) && sorted.length > 0 ? sorted : Array.isArray(filtered) && filtered.length > 0 ? filtered : []) : (Array.isArray(apartments) ? apartments : []);
    
  const handleDelete = (flatId) => {
    setApartments((prev) => prev.filter((flat) => flat.id !== flatId)); // Actualizează starea locală
  };

  return (
    <>
      {isAuthenticated && 
        <div className={styles.tools}>
          <Filter
            apartments={apartments}
            onFilter={setFilteredApartments}
            onReset={() => setFilteredApartments(null)}
          />
          <Sort apartments={apartments} onSort={setSortedApartments} />
        </div>
      }
      <div className="main-body">
        <DisplayAmountOfApartments apartments={displayedApartments} />
        {isLoading ? (
          <div className="spinnerContainer">
            <div className="spinner"></div>
          </div>
        ) : (
            <div className="all-flats">
              {(displayedApartments).map((flat, index) => (
                <Card key={index} flat={flat} showTrash={true} onDelete={handleDelete}/>
              ))}
            </div> 
            )
          }
      </div>
    </>
  );
};

export default Home;
