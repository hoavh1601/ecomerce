// src/components/layout/AdminLayout.jsx
import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Content, Sider } = Layout;

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Products</Link>,
    },
    {
      key: "/admin/orders",
      icon: <OrderedListOutlined />,
      label: <Link to="/admin/orders">Orders</Link>,
    },
    {
      key: "/admin/categories",
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/categories">Categories</Link>,
    },
  ];

  return (
    <Layout>
      <Sider width={200} theme="light">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ height: "100vh" }}
        />
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
