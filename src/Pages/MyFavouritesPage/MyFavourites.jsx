import { useApartments } from "../../utilFunctions";
import Card from "../../Components/Card/Card";
import DisplayAmountOfApartments from "../../Components/DisplayAmountOfApartments/DisplayAmountOfApartments";
import { useFavourites } from "../../Contexts/FavouriteContext";

const MyFavourites = () => {
  const { isLoading } = useApartments();
  const { favourites } = useFavourites();

  return (
    <>
      <div className="main-body">
        <DisplayAmountOfApartments apartments={favourites} />
        {isLoading ? (
          <div className="spinnerContainer">
            <div className="spinner"></div>
          </div>
          ) : (
            <div className="my-favourites">
              {favourites.map((flat, index) => (
                  <Card
                    key={index}
                    flat={flat}
                    showTrash={false}
                  />
              ))}
            </div>
          )
        }
      </div>
    </>
  );
};

export default MyFavourites;
