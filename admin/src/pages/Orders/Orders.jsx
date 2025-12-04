import { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from "axios";
import { assets } from '../../../../frontend/src/assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders
  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`);
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  // Update order details
  const updateOrder = async (orderId, updatedData) => {
    try {
      const response = await axios.put(`${url}/api/order/${orderId}`, updatedData);
      if (response.data.success) {
        toast.success('Order updated successfully!');
        await fetchAllOrders(); 
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      toast.error('Network error. Please try again later.');
    }
  };

  // Handle input change
  const handleChange = (orderId, field, value) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) => {
        if (order._id === orderId) {
          
          const updatedOrder = { ...order };
          const fields = field.split('.'); 
          let currentField = updatedOrder;

          fields.forEach((key, index) => {
            if (index === fields.length - 1) {
              currentField[key] = value;
            } else {
              currentField = currentField[key];
            }
          });

          return updatedOrder;
        }
        return order;
      });
      return updatedOrders;
    });
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await axios.delete(`${url}/api/order/delete/${orderId}`);
      if (response.data.success) {
        toast.success('Order deleted successfully!');
        await fetchAllOrders(); 
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      toast.error('Network error. Please try again later.');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-fur">
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <input
                      type="text"
                      value={`${item.name} x ${item.quantity}`}
                      onChange={(e) =>
                        handleChange(order._id, `items.${itemIndex}.name`, e.target.value)
                      }
                      onBlur={() =>
                        updateOrder(order._id, {
                          items: order.items.map((itm, idx) =>
                            idx === itemIndex
                              // eslint-disable-next-line no-undef
                              ? { ...itm, name: e.target.value.split(' x ')[0], quantity: itm.quantity }
                              : itm
                          ),
                        })
                      }
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleChange(order._id, `items.${itemIndex}.quantity`, e.target.value)
                      }
                      onBlur={() =>
                        updateOrder(order._id, {
                          items: order.items.map((itm, idx) =>
                            idx === itemIndex
                              ? { ...itm, quantity: e.target.value }
                              : itm
                          ),
                        })
                      }
                    />
                  </div>
                ))}
              </p>

              <input
                type="text"
                value={order.address.firstName}
                onChange={(e) => handleChange(order._id, 'address.firstName', e.target.value)}
                onBlur={() => updateOrder(order._id, { address: order.address })}
              />
              <input
                type="text"
                value={order.address.lastName}
                onChange={(e) => handleChange(order._id, 'address.lastName', e.target.value)}
                onBlur={() => updateOrder(order._id, { address: order.address })}
              />
              <div className="order-item-address">
                <input
                  type="text"
                  value={order.address.street}
                  onChange={(e) => handleChange(order._id, 'address.street', e.target.value)}
                  onBlur={() => updateOrder(order._id, { address: order.address })}
                />
                <input
                  type="text"
                  value={order.address.city}
                  onChange={(e) => handleChange(order._id, 'address.city', e.target.value)}
                  onBlur={() => updateOrder(order._id, { address: order.address })}
                />
              </div>
              <p className="order-item-phone">
                <input
                  type="text"
                  value={order.address.phone}
                  onChange={(e) => handleChange(order._id, 'address.phone', e.target.value)}
                  onBlur={() => updateOrder(order._id, { address: order.address })}
                />
              </p>
            </div>

            <p>Item Count: {order.items.length}</p>
            <p>${order.amount}</p>

            <select
              value={order.status}
              onChange={(e) => handleChange(order._id, 'status', e.target.value)}
              onBlur={() => updateOrder(order._id, { status: order.status })}
            >
              <option value="Furniture Processing">Furniture Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

            <button onClick={() => deleteOrder(order._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
