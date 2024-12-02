import React, { useState } from "react";
import { Table, Card, Button, Modal, Form, Input, Space, message } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../features/admin/adminApi";

const Categories = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { data, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          data: values,
        }).unwrap();
        message.success("Category updated successfully");
      } else {
        await createCategory(values).unwrap();
        message.success("Category created successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setEditingCategory(record);
            form.setFieldsValue(record);
            setIsModalVisible(true);
          }}
        />
      ),
    },
  ];

  return (
    <Card
      title="Categories Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Category
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        rowKey="_id"
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Categories;
