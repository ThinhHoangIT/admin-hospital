import { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import api from '@/services/api';
import Detail from './Detail';
import AppHeader from '@/components/AppHeader';
import { formatDate, formatFullDateTime } from '@/commons/utils';
import ModalTable from '@/components/ModalTable';

const columns = [
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: 'Tên',
    key: 'name',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: 'Số điện thoại',
    key: 'phone',
    dataIndex: 'phone',
    width: 90,
  },
  {
    title: 'Địa chỉ',
    key: 'address',
    dataIndex: 'address',
    width: 220,
  },
  {
    title: 'Ngày sinh',
    key: 'birthday',
    dataIndex: 'birthday',
    width: 90,
    render: text => formatDate(text),
  },
];

const Patient = () => {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const getUsers = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getUsers(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get users error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const backToTable = () => {
    setDetail(null);
  };

  const displayDetail = (record, index) => {
    setDetail(record);
  };

  const onSearch = value => {
    getUsers({ keyword: value });
  };

  const onChangeStatus = (record, newStatus) => {
    setLoading(true);
    api
      .updateUserStatus(record._id, { newStatus })
      .then(response => {
        messageApi.success('Cập nhật trạng thái thành công');
        getUsers();
      })
      .catch(error => {
        console.log('Update status error', error);
        messageApi.error('Cập nhật trạng thái thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onAdd = () => {
    NiceModal.show('add-user', {
      messageApi,
      onSuccess: () => {
        getUsers();
        messageApi.success('Thêm thành công');
      },
    });
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-user', {
      data: record,
      messageApi,
      onSuccess: () => {
        getUsers();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteUser(record._id)
      .then(() => {
        getUsers();
      })
      .catch(error => {
        console.log('Delete user error', error);
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết bệnh nhân"
        showDetailText={detail?._id}
        onMenuClick={backToTable}
      />
      <Layout.Content>
        {detail?._id ? (
          <Detail
            data={detail}
            onEdit={onEdit}
            onDelete={onDelete}
            onBack={backToTable}
          />
        ) : (
          <ModalTable
            columns={columns}
            data={data}
            loading={loading}
            onClick={displayDetail}
            onSearch={onSearch}
            onChangeStatus={onChangeStatus}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            modalType="user"
          />
        )}
      </Layout.Content>
    </Layout>
  );
};

export default Patient;
