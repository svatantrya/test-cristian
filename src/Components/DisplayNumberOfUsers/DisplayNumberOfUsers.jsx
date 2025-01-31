/* eslint-disable react/prop-types */

const DisplayNumberOfUsers = ({ users }) => {
  const number = users.length;
  return (
    <h2 className="title">
      {number === 1
        ? `There is ${number} registered user `
        : `There are ${number} registered users`}
    </h2>
  );
};

export default DisplayNumberOfUsers;
