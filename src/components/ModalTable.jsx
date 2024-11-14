import { useMemo, useRef } from 'react';
import { Table, Button, Space, Input, Dropdown, Tag, Popconfirm } from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const Container = styled.div({
  padding: 24,
});

const Filter = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
});

const Search = styled(Input)({
  // width: '30%',
});

const CustomTable = styled(Table)({
  '.ant-table-tbody>tr.ant-table-row:hover>td': {
    cursor: 'pointer',
  },
});

const DeleteIcon = styled(DeleteOutlined)({
  color: 'red',
});

const FilterButton = styled(Button)({
  fontSize: 13,
});

const userStatuses = [
  { value: 'active', label: 'Kích hoạt', color: 'green' },
  { value: 'inactive', label: 'Hủy kích hoạt', color: 'red' },
];

const scheduleStatuses = [
  { value: 'on', label: 'Làm việc', color: 'green' },
  { value: 'off', label: 'Nghỉ', color: 'red' },
];

const appointmentStatuses = [
  { value: 'pending', label: 'Đang chờ', color: 'orange' },
  { value: 'approved', label: 'Đã khám', color: 'green' },
  { value: 'rejected', label: 'Đã hủy', color: 'red' },
];

const statusMapping = {
  user: userStatuses,
  appointment: appointmentStatuses,
  schedule: scheduleStatuses,
};

const preventRowClick = e => e.stopPropagation();

const ModalTable = ({
  columns,
  data,
  loading,
  onClick,
  onSearch,
  onEdit,
  onDelete,
  onChangeStatus,
  onCreateMedication,
  filterComponents,
  showFilter = false,
  showActions = true,
  showSearch = true,
  fixed = true,
  showStatus = true,
  createMedication = false,
  scroll,
  pagination,
  modalType = '',
  onAdd,
}) => {
  const searchTimer = useRef();

  const onRow = (record, rowIndex) => {
    return {
      onClick: e => {
        onClick?.(record, rowIndex);
      },
    };
  };

  const onSearchChange = e => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => {
      onSearch?.(e.target.value);
    }, 300);
  };

  const tableColumns = useMemo(() => {
    return [
      {
        title: 'STT',
        key: 'index',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 48,
        fixed: fixed ? 'left' : fixed,
      },
      ...columns,
      ...(showStatus
        ? [
            {
              title: 'Trạng thái',
              key: 'status',
              width: 120,
              align: 'center',
              render: (text, record) => {
                const statuses = statusMapping[modalType] || [];
                const currentStatus = statuses.find(
                  s => s.value === record.status,
                );
                return (
                  <Dropdown
                    menu={{
                      items: statuses.map(s => ({
                        key: s.value,
                        label: (
                          <Tag color={s.color} key={s.value}>
                            {s.label}
                          </Tag>
                        ),
                      })),
                      onClick: e => {
                        e.domEvent.stopPropagation();
                        onChangeStatus?.(record, e.key);
                      },
                    }}
                    placement="topLeft"
                  >
                    <span onClick={e => e.stopPropagation()}>
                      <Tag
                        color={currentStatus?.color}
                        style={{ cursor: 'pointer' }}
                      >
                        {currentStatus?.label}
                      </Tag>
                    </span>
                  </Dropdown>
                );
              },
            },
          ]
        : []),
      ...(showActions
        ? [
            {
              title: 'Hành động',
              key: 'action',
              width: 100,
              render: record => (
                <Space size="middle" onClick={preventRowClick}>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => onEdit?.(record)}
                  />
                  <Popconfirm
                    title="Bạn có chắc muốn xóa dữ liệu này ?"
                    description="Thao tác này có thể ảnh hưởng tới các tính năng khác"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => onDelete?.(record)}
                  >
                    <Button icon={<DeleteIcon />} size="small" />
                  </Popconfirm>
                </Space>
              ),
            },
          ]
        : []),
      ...(createMedication
        ? [
            {
              title: 'Tạo đơn thuốc',
              key: 'medication',
              width: 40,
              align: 'center',
              render: record => (
                <Space size="middle">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => onCreateMedication?.(record)}
                  />
                </Space>
              ),
            },
          ]
        : []),
    ];
  }, [columns, showStatus, modalType]);

  return (
    <Container>
      {showSearch && (
        <Filter>
          <Space className="row">
            <Search
              addonBefore={<SearchOutlined />}
              placeholder="Nhập nội dung cần tìm"
              onChange={onSearchChange}
              allowClear
              spellCheck={false}
              autoComplete="nope"
            />
            {showFilter && <>{filterComponents}</>}
          </Space>
          <Space>
            {onAdd && (
              <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                Thêm mới
              </Button>
            )}
          </Space>
        </Filter>
      )}
      <CustomTable
        columns={tableColumns}
        dataSource={data}
        onRow={onRow}
        loading={loading}
        size="small"
        rowKey={row => row.id || row._id || row.name || row}
        bordered
        pagination={pagination}
        scroll={scroll}
      />
    </Container>
  );
};

export default ModalTable;
