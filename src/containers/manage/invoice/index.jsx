import { useEffect, useState } from 'react';
import { Layout, message } from 'antd';

import api from '@/services/api';
import AppHeader from '@/components/AppHeader';
import { formatDate, formatPrice } from '@/commons/utils';
import { getDepartmentName } from '@/commons/locale';
import ModalTable from '@/components/ModalTable';

const columns = [
  {
    title: 'Tên bệnh nhân',
    dataIndex: ['user', 'name'],
    key: 'user.name',
  },
  {
    title: 'Ngày khám',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: text => <span>{formatDate(text)}</span>,
  },
  {
    title: 'Khoa khám',
    dataIndex: ['appointment', 'departmentId'],
    key: 'appointment.departmentId',
    render: text => <span>{getDepartmentName(text)}</span>,
  },
  {
    title: 'Bệnh án',
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: 'Thuốc kê',
    dataIndex: 'medication',
    key: 'medication',
    render: text => text.map(med => med).join(', '),
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'amount',
    key: 'amount',
    render: text => <span>{formatPrice(text)}</span>,
  },
];

const Invoice = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const getInvoices = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getInvoices(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get invoices error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInvoices();
  }, []);

  const onSearch = value => {
    getInvoices({ keyword: value });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader detailText="Chi tiết hóa đơn" />
      <Layout.Content>
        <ModalTable
          columns={columns}
          data={data}
          loading={loading}
          onSearch={onSearch}
          showActions={false}
          showStatus={false}
        />
      </Layout.Content>
    </Layout>
  );
};

export default Invoice;
