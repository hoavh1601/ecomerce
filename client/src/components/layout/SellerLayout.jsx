import React from "react";
import { Layout, Menu } from "antd";
import { ShopOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Link, useLocation, Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const SellerLayout = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/seller/products",
      icon: <ShopOutlined />,
      label: <Link to="/seller/products">Products</Link>,
    },
    {
      key: "/seller/orders",
      icon: <UnorderedListOutlined />,
      label: <Link to="/seller/orders">Orders</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" width={200}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: "100%", borderRight: 0 }}
          items={menuItems}
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

export default SellerLayout;
