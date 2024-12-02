// src/pages/admin/Products.jsx
import React, { useState } from "react";
import { Table, Card, Space, Input, Button, Modal, message } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../features/admin/adminApi";
const { Search } = Input;
const { confirm } = Modal;

const Products = () => {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetProductsQuery(filters);
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = (productId) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone",
      onOk: async () => {
        try {
          await deleteProduct(productId).unwrap();
          message.success("Product deleted successfully");
        } catch (error) {
          message.error("Failed to delete product");
        }
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <img
          src={images[0]}
          alt="product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Seller",
      dataIndex: ["seller", "fullName"],
      key: "seller",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDelete(record._id)}
        />
      ),
    },
  ];

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search products"
          allowClear
          onSearch={(value) =>
            setFilters((prev) => ({
              ...prev,
              search: value,
              page: 1,
            }))
          }
          style={{ width: 300 }}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        rowKey="_id"
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: data?.total,
          onChange: (page) => setFilters((prev) => ({ ...prev, page })),
        }}
      />
    </Card>
  );
};

export default Products;
