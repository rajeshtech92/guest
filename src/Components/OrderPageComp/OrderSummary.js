import React from 'react';
import { useOrder } from './OrderContext';

function OrderSummary() {
  const { order } = useOrder();

  return (
    <div>
      <h2>Order Summary</h2>
      {order ? (
        <div>
          <p>Item: {order.menuItemName}</p>
          <p>Quantity: {order.itemQuantity}</p>
          <p>Price: ₹{order.price}</p>
        </div>
      ) : (
        <p>No order data available.</p>
      )}
    </div>
  );
}

export default OrderSummary;
