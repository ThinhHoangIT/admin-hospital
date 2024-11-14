import { useEffect, useState } from 'react';
import { Card, Descriptions } from 'antd';
import styled from 'styled-components';

import { formatFullDateTime } from '@/commons/utils';
import api from '@/services/api';

const Container = styled.div({
  padding: 12,
  userSelect: 'text !important',
  height: '100%',
  overflow: 'auto',
});

const CardTitle = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 14,
});

const Detail = ({ data, onBack }) => {
  const [detail, setDetail] = useState(data);

  if (!data) {
    return <Container>Dữ liệu rỗng</Container>;
  }

  const items = [
    {
      key: 'name',
      label: 'Bác sĩ trực',
      children: detail.name,
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      children: detail.phone,
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      children: detail.address,
    },
    {
      key: 'birthday',
      label: 'Ngày sinh',
      children: formatFullDateTime(detail.birthday),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      children: detail.status === 'on' ? 'Ngày làm' : 'Ngày nghỉ',
    },
    {
      key: 'createdAt',
      label: 'Thời gian tạo',
      children: formatFullDateTime(detail.createdAt),
    },
    {
      key: 'updatedAt',
      label: 'Thời gian cập nhật',
      children: formatFullDateTime(detail.updatedAt),
    },
  ];

  const getDetailData = () => {
    // api
    //   .getUser(detail._id)
    //   .then(response => {
    //     setDetail(response.data);
    //   })
    //   .catch(error => {
    //     console.log('Get detail error', error);
    //   });
  };

  useEffect(() => {
    getDetailData();
  }, []);

  return (
    <Container>
      <Card bordered={false} size="small">
        <Descriptions
          title={
            <CardTitle>
              <span>Thông tin cơ bản</span>
            </CardTitle>
          }
          bordered
          items={items}
          size="small"
          column={1}
        />
      </Card>
    </Container>
  );
};

export default Detail;
