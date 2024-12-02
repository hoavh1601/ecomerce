import React, { useState } from "react";
import { Table, Card, Space, Input, Tag } from "antd";
import { useGetAdminOrdersQuery } from "../../features/admin/adminApi";

const { Search } = Input;

const Orders = () => {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetAdminOrdersQuery(filters);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => `#${id.slice(-6)}`,
    },
    {
      title: "Customer",
      dataIndex: ["user", "fullName"],
      key: "customer",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          PENDING: "gold",
          PROCESSING: "blue",
          COMPLETED: "green",
          CANCELLED: "red",
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <Card title="Orders Management">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search orders"
          allowClear
          onSearch={(value) =>
            setFilters((prev) => ({ ...prev, search: value, page: 1 }))
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

export default Orders;
