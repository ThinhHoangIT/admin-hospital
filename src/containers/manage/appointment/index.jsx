import { useEffect, useState } from 'react';
import { DatePicker, Layout, message, Space } from 'antd';

import api from '@/services/api';
import AppHeader from '@/components/AppHeader';
import { formatDate } from '@/commons/utils';
import ModalTable from '@/components/ModalTable';
import NiceModal from '@ebay/nice-modal-react';
import storage from '@/storage';

const columns = [
  {
    title: 'Tên bệnh nhân',
    dataIndex: ['userId', 'name'],
    key: 'userId.name',
    width: 120,
  },
  {
    title: 'Ngày hẹn',
    key: 'date',
    dataIndex: 'date',
    width: 90,
    render: text => formatDate(text),
  },
];

const defaultFilter = {
  keyword: '',
  startTime: '',
  endTime: '',
  department: '',
};

const Appointment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(defaultFilter);

  const user = storage.getUser();
  const department = user?.department;

  const [messageApi, contextHolder] = message.useMessage();

  const getAppointments = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getAppointments(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get appointments error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const today = new Date();
    setFilter({
      ...defaultFilter,
      startTime: today.setHours(0, 0, 0, 0),
    });
  }, []);

  useEffect(() => {
    getAppointments(getQuery());
  }, [filter]);

  const getQuery = () => {
    const query = {
      department,
    };
    if (filter.keyword.length) {
      query.keyword = filter.keyword;
    }
    if (filter.startTime) {
      query.startTime = filter.startTime;
    }
    if (filter.endTime) {
      query.endTime = filter.endTime;
    }
    return query;
  };

  const onSearch = value => {
    setFilter({ ...filter, keyword: value });
  };
  const onSelectStartDate = date => {
    if (filter?.endTime && date?.isAfter(dayjs(filter.endTime))) {
      messageApi.warning('Ngày bắt đầu phải sau ngày kết thúc');
      return;
    }
    setFilter({ ...filter, startTime: date ? date.valueOf() : null });
  };
  const onSelectEndDate = date => {
    if (filter?.startTime && date?.isBefore(dayjs(filter.startTime))) {
      messageApi.warning('Ngày kết thúc phải trước ngày bắt đầu');
      return;
    }
    setFilter({ ...filter, endTime: date ? date.valueOf() : null });
  };

  const onChangeStatus = (record, newStatus) => {
    setLoading(true);
    api
      .updateAppointmentStatus(record._id, { newStatus })
      .then(response => {
        messageApi.success('Cập nhật trạng thái thành công');
        getAppointments(getQuery());
      })
      .catch(error => {
        console.log('Update status error', error);
        messageApi.error('Cập nhật trạng thái thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCreateMedication = record => {
    NiceModal.show('add-prescription', {
      data: record,
      messageApi,
      onSuccess: () => {
        getAppointments(getQuery());
        messageApi.success('Thêm thành công');
      },
    });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader />
      <Layout.Content>
        <ModalTable
          filterComponents={
            <Space>
              <DatePicker
                allowClear
                showTime
                onChange={onSelectStartDate}
                format={'DD/MM/YYYY'}
                placeholder={'Ngày bắt đầu'}
              />
              <DatePicker
                allowClear
                showTime
                format={'DD/MM/YYYY'}
                onChange={onSelectEndDate}
                placeholder={'Ngày kết thúc'}
              />
            </Space>
          }
          columns={columns}
          data={data}
          loading={loading}
          onSearch={onSearch}
          onChangeStatus={onChangeStatus}
          showActions={false}
          onCreateMedication={onCreateMedication}
          modalType="appointment"
          createMedication
          showFilter
        />
      </Layout.Content>
    </Layout>
  );
};

export default Appointment;
