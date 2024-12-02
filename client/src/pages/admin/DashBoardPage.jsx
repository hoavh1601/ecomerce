import React from "react";
import { Row, Col, Card, Statistic, Table } from "antd";
import {
  useGetDashboardStatsQuery,
  useGetTopProductsQuery,
} from "../../features/admin/adminApi";
import {
  DollarOutlined,
  UserOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: topProducts, isLoading: productsLoading } =
    useGetTopProductsQuery(5);

  const productColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (sales) => `$${sales.toFixed(2)}`,
    },
    {
      title: "Quantity Sold",
      dataIndex: "quantitySold",
      key: "quantitySold",
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats?.totalRevenue}
              prefix={<DollarOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers}
              prefix={<UserOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats?.totalProducts}
              prefix={<ShoppingOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats?.totalOrders}
              prefix={<OrderedListOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Top Selling Products" style={{ marginTop: 16 }}>
        <Table
          columns={productColumns}
          dataSource={topProducts?.data}
          loading={productsLoading}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
