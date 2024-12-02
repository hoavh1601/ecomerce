import React, { useState } from "react";
import { Table, Card, Space, Input, Tag } from "antd";
import { useGetOrdersQuery } from "../../features/admin/adminApi";
const { Search } = Input;

const Orders = () => {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetOrdersQuery(filters);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Customer",
      dataIndex: ["user", "fullName"],
      key: "user",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "PENDING"
              ? "gold"
              : status === "PROCESSING"
              ? "blue"
              : status === "COMPLETED"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search orders"
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
export default Orders;
