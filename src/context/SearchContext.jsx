// src/context/SearchContext.jsx
import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  // null = no search applied (show all rooms)
  const [searchFilters, setSearchFilters] = useState(null);

  const applySearch = (filters) => {
    setSearchFilters({
      ...filters,
      // just for debugging / forcing rerender if needed
      appliedAt: Date.now(),
    });
  };

  const clearSearch = () => {
    setSearchFilters(null);
  };

  return (
    <SearchContext.Provider
      value={{
        searchFilters,
        applySearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
