import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toggleAdmin, deleteUser, useUsers } from "../../utilFunctions";
import DisplayNumberOfUsers from "../../Components/DisplayNumberOfUsers/DisplayNumberOfUsers";
import UserFilter from "../../Components/UserFilter/UserFilter";
import UserSort from "../../Components/UserSort/UserSort";
import styles from "./AllUsers.module.css";

const ListUsers = () => {
  const {
    users,
    filteredUsers,
    fetchUsers,
    filterUsers,
    sortUsers,
    resetFilters,
    resetSort,
  } = useUsers();

  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilter = (criteria) => {
    filterUsers(criteria);
  };

  const handleSort = (criteria) => {
    sortUsers(criteria);
  };

  const handleReset = () => {
    resetFilters();
  };

  const handleResetSort = () => {
    resetSort();
  };

  const handleToggleAdmin = async (uid, isAdmin) => {
    await toggleAdmin(uid, isAdmin);
    const updatedUsers = users.map((user) =>
      user.uid === uid ? { ...user, isAdmin: !isAdmin } : user
    );
    fetchUsers(updatedUsers); // Actualizează starea utilizatorilor
  };

  const handleEditUser = async (uid) => {
    // const data = await getUserData(uid);
    setIsEditing(true);
    navigate(`/edit-user/${uid}`);
  };

  const handleDeleteUser = async (uid) => {
    await deleteUser(uid);
    fetchUsers(); // Actualizează lista după ștergere
  };

  const handleCloseEdit = () => {
    setIsEditing(false); // Resetează starea de editare
  };

  return (
    <>
      <div className={styles.tools}>
        <UserFilter onFilter={handleFilter} onReset={handleReset} />
        <UserSort onSort={handleSort} onReset={handleResetSort} />
      </div>
      <DisplayNumberOfUsers users={users} />
      <table>
        <thead>
          <tr className={styles.header}>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Birth Date</th>
            <th>Number of flats</th>
            <th>Admin</th>
            <th>Toggle admin role</th>
            <th>Edit User</th>
            <th>Delete User</th>
          </tr>
        </thead>
        <tbody className={styles.elements}>
          {filteredUsers.map((user) => (
            <tr key={user.uid}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.birthDate}</td>
              <td>{user.flats.length}</td>
              <td>{user.isAdmin ? "Yes" : "No"}</td>
              <td>
                <button
                  className={styles["list-btn"]}
                  onClick={() => handleToggleAdmin(user.uid, user.isAdmin)}
                >
                  Toggle Admin
                </button>
              </td>
              <td>
                <button
                  className={styles["list-btn"]}
                  onClick={() => handleEditUser(user.uid)}
                >
                  Edit User
                </button>
              </td>
              <td>
                <button
                  className={styles["list-btn"]}
                  onClick={() => handleDeleteUser(user.uid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListUsers;
