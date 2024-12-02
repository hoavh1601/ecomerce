import React, { useState } from "react";
import { Table, Card, Space, Input, Tag, Button, message } from "antd";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "../../features/admin/adminApi";

const { Search } = Input;

const Users = () => {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetUsersQuery(filters);
  const [updateStatus] = useUpdateUserStatusMutation();

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      await updateStatus({
        userId,
        status: currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE",
      }).unwrap();
      message.success("User status updated successfully");
    } catch (error) {
      message.error("Failed to update user status");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "SELLER" ? "blue" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "success" : "error"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          danger={record.status === "ACTIVE"}
          onClick={() => handleStatusChange(record._id, record.status)}
        >
          {record.status === "ACTIVE" ? "Ban" : "Unban"}
        </Button>
      ),
    },
  ];

  return (
    <Card title="Users Management">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search users"
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

export default Users;
