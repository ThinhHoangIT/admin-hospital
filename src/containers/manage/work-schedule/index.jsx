import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Layout,
  message,
  Divider,
  Spin,
  Space,
} from 'antd';
import styled from 'styled-components';
import NiceModal from '@ebay/nice-modal-react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

import AppHeader from '@/components/AppHeader';
import Detail from './Detail';
import colors from '@/theme/color';
import api from '@/services/api';

const { Title } = Typography;

const ShiftTitle = styled(Title)`
  text-align: center;
`;

const Container = styled(Layout.Content)({
  padding: '8px 8px',
});

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  cursor: pointer;
  background-color: ${props =>
    props.status === 'on' ? colors.lightGreen : colors.danger};
`;

const WorkSchedule = ({ departmentId }) => {
  const [schedules, setSchedules] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const daysOfWeek = [
    {
      id: `${departmentId}_monday`,
      label: 'Thứ 2',
      value: 0,
    },
    {
      id: `${departmentId}_tuesday`,
      label: 'Thứ 3',
      value: 1,
    },
    {
      id: `${departmentId}_wednesday`,
      label: 'Thứ 4',
      value: 2,
    },
    {
      id: `${departmentId}_thursday`,
      label: 'Thứ 5',
      value: 3,
    },
    {
      id: `${departmentId}_friday`,
      label: 'Thứ 6',
      value: 4,
    },
  ];

  const getWorkSchedules = () => {
    if (loading) return;
    setLoading(true);

    const params = {
      department: departmentId,
    };

    api
      .get('/schedules', { params })
      .then(response => {
        setSchedules(response.data);
      })
      .catch(error => {
        console.error('Get workSchedules error', error);
        messageApi.error(
          'Tải danh sách thất bại: ' + (error.message || 'Đã xảy ra lỗi'),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Đảm bảo rằng getWorkSchedules được gọi khi departmentId thay đổi
  useEffect(() => {
    if (departmentId) {
      getWorkSchedules();
    }
  }, [departmentId]);

  const displayDetail = schedule => {
    setDetail(schedule);
  };

  const backToTable = () => {
    setDetail(null);
  };

  const onEdit = (e, schedule, dayId) => {
    e.stopPropagation();
    NiceModal.show('add-schedule', {
      departmentId,
      data: schedule,
      dayId,
      messageApi,
      onSuccess: () => {
        getWorkSchedules();
        messageApi.success('Cập nhật thành công');
      },
    });
  };

  const renderShift = shift => (
    <>
      <ShiftTitle level={2} type="secondary">
        {shift === 'morning' ? 'Ca sáng' : 'Ca chiều'}
      </ShiftTitle>
      <Row gutter={24} justify="center">
        {daysOfWeek.map(day => {
          const schedule = schedules.find(
            s => s.shift === shift && s.dayOfWeek === day.value,
          );
          return (
            <Col span={4} key={day.id}>
              <StyledCard
                title={day.label}
                status={schedule?.status || 'off'}
                onClick={() => displayDetail(schedule)}
                extra={
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={e => onEdit(e, schedule, day.id)}
                  />
                }
              >
                <Card.Meta
                  description={schedule?.employeeData?.name || 'Chưa phân công'}
                />
              </StyledCard>
            </Col>
          );
        })}
      </Row>
    </>
  );

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết lịch làm việc"
        showDetailText={detail?.id}
        onMenuClick={backToTable}
      />
      <Container>
        <Spin spinning={loading}>
          {detail?.id ? (
            <Detail
              data={detail}
              onEdit={getWorkSchedules}
              onDelete={getWorkSchedules}
              onBack={backToTable}
            />
          ) : (
            <>
              {renderShift('morning')}
              <Divider />
              {renderShift('afternoon')}
            </>
          )}
        </Spin>
      </Container>
    </Layout>
  );
};

export default WorkSchedule;
