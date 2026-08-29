import React, { createContext, useContext } from "react";
import { useCVData } from "./useCVData";

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { data, error } = useCVData();
  return (
    <DataContext.Provider value={{ data, error }}>
      {children}
    </DataContext.Provider>
  );
};
