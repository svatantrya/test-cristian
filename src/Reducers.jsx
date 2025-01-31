import { calculateAge } from "./utilFunctions";

export const apartmentReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        apartments: action.payload,
        filtered: null,
        sorted: null
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        apartments: [],
      };
    case "FETCH_FILTERED": {
      const newState = { ...state, filtered: action.payload };
      return newState;
    }
    case "FETCH_SORTED": {
      const newState = { ...state, sorted: action.payload };
      return newState;
    }
    case "SET_APARTMENTS":
      return { ...state, apartments: action.payload, filtered: null, sorted: null };
    case "CLEAR":
      return { ...state, apartments: [], error: null, isLoading: false };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USERS":
      return {
        ...state,
        users: action.payload,
        filteredUsers: action.payload,
        isLoading: false,
      };
    case "FILTER_USERS": {
      const { isAdmin, ageRange, flatsRange } = action.payload;
      const filtered = state.users.filter((user) => {
        const age = calculateAge(user.birthDate);
        const flatsCount = user.flats?.length || 0;
        return (
          (isAdmin === null || user.isAdmin === isAdmin) &&
          (ageRange.min === null || age >= ageRange.min) &&
          (ageRange.max === null || age <= ageRange.max) &&
          (flatsRange.min === null || flatsCount >= flatsRange.min) &&
          (flatsRange.max === null || flatsCount <= flatsRange.max)
        );
      });
      return { ...state, filteredUsers: filtered };
    }
    case "SORT_USERS": {
      const { key, order } = action.payload;
      const sorted = [...state.filteredUsers].sort((a, b) => {
        if (key === "firstName") {
          return order === "asc"
            ? a.firstName.localeCompare(b.firstName)
            : b.firstName.localeCompare(a.firstName);
        }
        if (key === "lastName") {
          return order === "asc"
            ? a.lastName.localeCompare(b.lastName)
            : b.lastName.localeCompare(a.lastName);
        }
        if (key === "flatsCount") {
          return order === "asc"
            ? (a.flats?.length || 0) - (b.flats?.length || 0)
            : (b.flats?.length || 0) - (a.flats?.length || 0);
        }
        return 0;
      });
      return { ...state, filteredUsers: sorted };
    }
    case "RESET_SORT":
      return { ...state, filteredUsers: state.users };
    case "RESET_FILTERS":
      return { ...state, filteredUsers: state.users };
    default:
      return state;
  }
};
