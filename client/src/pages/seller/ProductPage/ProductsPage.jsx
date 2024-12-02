import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Card,
  Row,
  Col,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  useGetSellerProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
} from "../../../features/seller/sellerApi";
import { useSelector } from "react-redux";

const { Search } = Input;

const ProductPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [filters, setFilters] = useState({
    name: "",
    minPrice: null,
    maxPrice: null,
    stockFilter: "all",
    categoryId: "",
    page: 1,
    limit: 10,
    sellerId: user?._id,
  });

  const { data, isLoading } = useGetSellerProductsQuery(filters, {
    skip: !user || !user._id,
  });

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const { data: categories } = useGetCategoriesQuery();

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
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
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Sale Price",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (salePrice) => (salePrice ? `$${salePrice}` : "-"),
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
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      message.success("Product deleted successfully");
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    const existingFileList = product.images.map((image, index) => ({
      uid: `-${index}`,
      name: image.split("/").pop(),
      status: "done",
      url: `${import.meta.env.VITE_API_IMAGE_URL}${image}`,
      originPath: image,
    }));
    setExistingImages(existingFileList);
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    const newFiles = newFileList.filter(
      (file) =>
        !existingImages.some(
          (existing) => existing.name === file.name || existing.url === file.url
        )
    );
    setFileList(newFiles);
  };

  const handleImageDelete = (file) => {
    if (file.originPath) {
      setExistingImages(existingImages.filter((img) => img.uid !== file.uid));
    } else {
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    }
  };

  const handleSubmit = async (values) => {
    try {
      console.log("Received values of form: ", values);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("categoryId", values.categoryId);
      formData.append("price", values.price);
      if (values.salePrice) {
        formData.append("salePrice", values.salePrice);
      }
      formData.append("stock", values.stock);

      console.log(existingImages, fileList);
      existingImages.forEach((image) => {
        formData.append("existingImages", image.originPath);
      });

      fileList.forEach((file) => {
        formData.append("images", file.originFileObj);
      });

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, formData }).unwrap();
        message.success("Product updated successfully");
      } else {
        await createProduct(formData).unwrap();
        message.success("Product created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      setExistingImages([]);
      setEditingProduct(null);
    } catch (error) {
      console.error("Operation failed:", error);
      message.error(
        "Operation failed: " + (error.data?.message || "Unknown error")
      );
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }

      const isDuplicate = existingImages.some(
        (existing) => existing.name === file.name
      );
      if (isDuplicate) {
        message.error("This image already exists!");
        return false;
      }

      return false;
    },
    onChange: handleChange,
    onRemove: (file) => {
      if (file.originPath) {
        setExistingImages((prev) => prev.filter((img) => img.uid !== file.uid));
      } else {
        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      }
    },
    fileList: [...existingImages, ...fileList],
    listType: "picture-card",
  };

  return (
    <div>
      <Card className="mb-4">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Name">
              <Search
                allowClear
                enterButton="Search"
                size="large"
                placeholder="Search by name"
                onSearch={(value) => handleFilterChange({ name: value })}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Price Range">
              <Space>
                <InputNumber
                  placeholder="Min"
                  onChange={(value) => handleFilterChange({ minPrice: value })}
                  style={{ width: 100 }}
                />
                <span>-</span>
                <InputNumber
                  placeholder="Max"
                  onChange={(value) => handleFilterChange({ maxPrice: value })}
                  style={{ width: 100 }}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Stock Status">
              <Select
                value={filters.stockFilter}
                onChange={(value) => handleFilterChange({ stockFilter: value })}
                style={{ minWidth: 200 }}
              >
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="inStock">In Stock</Select.Option>
                <Select.Option value="outOfStock">Out of Stock</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button
              type="default"
              icon={<FilterOutlined />}
              onClick={() =>
                handleFilterChange({
                  name: "",
                  minPrice: null,
                  maxPrice: null,
                  stockFilter: "all",
                })
              }
              style={{ marginTop: 30 }}
            >
              Clear Filters
            </Button>
          </Col>
          <Col span={6}>
            <Form.Item label="Category">
              <Select
                allowClear
                onChange={(value) => handleFilterChange({ categoryId: value })}
                style={{ minWidth: 200 }}
              >
                <Select.Option value="all">All Categories</Select.Option>
                {categories?.data?.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Product
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data?.data}
          loading={isLoading}
          rowKey="_id"
          pagination={{
            total: data?.total,
            pageSize: filters.limit,
            current: filters.page,
            onChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
        />
      </Card>

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setFileList([]);
          setEditingProduct(null);
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select category!" }]}
          >
            <Select>
              {categories?.data?.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>

          <Form.Item name="salePrice" label="Sale Price">
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Please input stock!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Images">
            <Upload {...uploadProps} listType="picture-card">
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
