import { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';
import LogsDrawer from '@/components/LogsDrawer';

const localeFields = {
  id: 'Mã thuốc',
  name: 'Tên thuốc',
};

const columns = [
  {
    title: 'Mã thuốc',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Tên thuốc',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Mô tả',
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: 'Giá',
    dataIndex: 'price',
    key: 'price',
  },
];

const Medication = () => {
  const [data, setData] = useState();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [logs, setLogs] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const getMedications = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getMedications(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get medications error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getMedicationsLogs = () => {
    api
      .getMedicationsLogs()
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.log('Get medications logs error', error);
        messageApi.error('Tải nhật ký thất bại');
      });
  };

  useEffect(() => {
    getMedications();
  }, []);

  useEffect(() => {
    if (showLog) {
      getMedicationsLogs();
    }
  }, [showLog]);

  const backToTable = () => {
    setDetail();
  };

  const displayDetail = (record, index) => {
    setDetail(record);
  };

  const closeLog = () => {
    setShowLog(false);
  };

  const onShowLog = () => {
    setShowLog(true);
  };

  const onSearch = value => {
    getMedications({ keyword: value });
  };

  const onAdd = () => {
    NiceModal.show('add-medication', {
      messageApi,
      onSuccess: () => {
        getMedications();
        messageApi.success('Thêm thành công');
      },
    });
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-medication', {
      data: record,
      messageApi,
      onSuccess: () => {
        getMedications();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteMedication(record.id)
      .then(() => {
        getMedications();
      })
      .catch(error => {
        console.log('Delete medications error', error);
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết thuốc"
        showDetailText={detail?.id}
        onMenuClick={backToTable}
      />
      <Layout.Content>
        {detail?.id ? (
          <Detail
            data={detail}
            onEdit={onEdit}
            onDelete={onDelete}
            onBack={backToTable}
          />
        ) : (
          <MasterTable
            columns={columns}
            data={data}
            loading={loading}
            onClick={displayDetail}
            onShowLog={onShowLog}
            onSearch={onSearch}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        <LogsDrawer
          open={showLog}
          onClose={closeLog}
          data={logs}
          localeFields={localeFields}
        />
      </Layout.Content>
    </Layout>
  );
};

export default Medication;
