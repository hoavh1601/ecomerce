// src/pages/HomePage.jsx
import React, { useState } from "react";
import { Card, Row, Col, Input, Select, InputNumber, Space } from "antd";
import {
  useGetPublicProductsQuery,
  useGetCategoriesQuery,
} from "../../../features/product/productApi";

const { Search } = Input;

const HomePage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
  });

  const { data: products, isLoading } = useGetPublicProductsQuery(filters);
  const { data: categories } = useGetCategoriesQuery();

  const ProductCard = ({ product }) => (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={`${import.meta.env.VITE_API_IMAGE_URL}${product.images[0]}`}
          style={{ height: 200, objectFit: "cover" }}
        />
      }
    >
      <Card.Meta
        title={product.name}
        description={
          <>
            <div>Price: ${product.price}</div>
            {product.salePrice && (
              <div style={{ color: "red" }}>Sale: ${product.salePrice}</div>
            )}
            <div>Category: {product.category?.name}</div>
          </>
        }
      />
    </Card>
  );

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 24 }} size="large">
        <Search
          placeholder="Search products"
          allowClear
          style={{ width: 300 }}
          onSearch={(value) =>
            setFilters((prev) => ({ ...prev, name: value, page: 1 }))
          }
        />

        <Select
          style={{ width: 200 }}
          placeholder="Select category"
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, categoryId: value, page: 1 }))
          }
        >
          <Select.Option value="all">All Categories</Select.Option>
          {categories?.data?.map((cat) => (
            <Select.Option key={cat._id} value={cat._id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>

        <Space>
          <InputNumber
            placeholder="Min price"
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, minPrice: value, page: 1 }))
            }
          />
          <InputNumber
            placeholder="Max price"
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, maxPrice: value, page: 1 }))
            }
          />
        </Space>

        <Select
          style={{ width: 150 }}
          placeholder="Sort by"
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(value) => {
            const [sortBy, order] = value.split("-");
            setFilters((prev) => ({ ...prev, sortBy, order, page: 1 }));
          }}
        >
          <Select.Option value="createdAt-desc">Newest</Select.Option>
          <Select.Option value="price-asc">Price: Low to High</Select.Option>
          <Select.Option value="price-desc">Price: High to Low</Select.Option>
        </Select>
      </Space>

      <Row gutter={[16, 16]}>
        {products?.data?.map((product) => (
          <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {/* Thêm Pagination nếu cần */}
    </div>
  );
};

export default HomePage;
