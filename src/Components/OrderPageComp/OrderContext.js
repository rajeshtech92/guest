import React, { createContext, useState, useContext } from 'react';

// Create a Context for the Order data
const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState(null);

  const addToOrder = (item) => {
    setOrder(item);
  };

  return (
    <OrderContext.Provider value={{ order, addToOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
