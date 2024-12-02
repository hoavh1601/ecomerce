import React from 'react';
import { Table, Tag, Button, message } from 'antd';
import { useGetSellerOrdersQuery, useUpdateOrderStatusMutation } from '../../features/seller/sellerApi';

const Orders = () => {
  const { data, isLoading } = useGetSellerOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Customer',
      dataIndex: ['buyer', 'fullName'],
      key: 'customer',
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'total',
      render: (amount) => `$${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'PENDING' ? 'blue' :
          status === 'CONFIRMED' ? 'green' :
          status === 'CANCELLED' ? 'red' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary"
          disabled={record.status === 'CANCELLED' || record.status === 'DELIVERED'}
          onClick={() => handleUpdateStatus(record._id)}
        >
          {record.status === 'PENDING' ? 'Confirm' : 'Update Status'}
        </Button>
      ),
    },
  ];

  const handleUpdateStatus = async (orderId) => {
    try {
      await updateStatus(orderId).unwrap();
      message.success('Order status updated successfully');
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  return (
    <Table 
      columns={columns} 
      dataSource={data?.data} 
      loading={isLoading}
      rowKey="_id"
    />
  );
};

export default Orders;