/* eslint-disable react/prop-types */

const DisplayNumberOfApartments = ({ apartments }) => {
  const number = apartments.length;
  return (
    <h2 className="title">
      {number === 1
        ? `There is ${number} flat available`
        : `There are ${number} flats available`}
    </h2>
  );
};

export default DisplayNumberOfApartments;
