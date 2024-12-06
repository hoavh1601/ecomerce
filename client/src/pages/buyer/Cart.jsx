import React from "react";
import { Table, Button, InputNumber, Empty, Card, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../features/order/orderApi";

const Cart = () => {
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        userId: user._id,
        status: "PENDING",
      };

      await createOrder(orderData).unwrap();
      message.success("Order created successfully");
      dispatch(clearCart()); // Clear cart after successful order
      navigate("/buyer/orders"); // Navigate to orders page
    } catch (error) {
      message.error(
        "Failed to create order: " + (error.data?.message || "Unknown error")
      );
    }
  };
  if (items.length === 0) {
    return (
      <Empty
        description="Your cart is empty"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={`${import.meta.env.VITE_API_IMAGE_URL}${record.images[0]}`}
            alt={name}
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
          {name}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) =>
            dispatch(updateQuantity({ id: record._id, quantity: value }))
          }
        />
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (_, record) => `$${record.price * record.quantity}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => dispatch(removeFromCart(record._id))}>
          Remove
        </Button>
      ),
    },
  ];

  if (items.length === 0) {
    return (
      <Empty
        description="Your cart is empty"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={items}
        rowKey="_id"
        pagination={false}
        footer={() => (
          <div style={{ textAlign: "right" }}>
            <h3>Total: ${total}</h3>
            <Button
              type="primary"
              size="large"
              loading={isLoading}
              onClick={handleCreateOrder}
            >
              Place Order
            </Button>
          </div>
        )}
      />
    </Card>
  );
};

export default Cart;
