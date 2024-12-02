import React, { useState } from "react";
import { Table, Card, Space, Input, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
} from "../../features/admin/adminApi";

const { Search } = Input;

const Products = () => {
  const [filters, setFilters] = useState({
    name: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetAdminProductsQuery(filters);
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      message.success("Product deleted successfully");
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <img
          src={`${import.meta.env.VITE_API_IMAGE_URL}${images[0]}`}
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
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Seller",
      dataIndex: ["seller", "fullName"],
      key: "seller",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
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
    <Card title="Products Management">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search products"
          allowClear
          onSearch={(value) =>
            setFilters((prev) => ({ ...prev, name: value, page: 1 }))
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
