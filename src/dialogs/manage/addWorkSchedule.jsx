import { Modal, Button, Form, Input, Radio, Select } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import api from '@/services/api';
import { useEffect, useState } from 'react';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const AddWorkSchedule = NiceModal.create(
  ({ departmentId, data, dayId, messageApi, onSuccess }) => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [scheduleId, setScheduleId] = useState('');
    const [form] = Form.useForm();

    const modal = useModal();

    console.log('data', data);

    useEffect(() => {
      api
        .getDepartments()
        .then(response => {
          setDepartments(
            response.data.map(department => {
              department.label = department.name;
              department.value = department.id;
              return department;
            }),
          );
        })
        .catch(error => {
          console.log('Get departments error', error);
          messageApi.error('Tải danh chuyên khoa sách thất bại');
        });
      api
        .getEmployees()
        .then(response => {
          setEmployees(
            response.data.map(employee => {
              employee.label = employee.name;
              employee.value = employee.id;
              return employee;
            }),
          );
        })
        .catch(error => {
          console.log('Get employee error', error);
          messageApi.error('Tải danh bác sĩ sách thất bại');
        });
    }, []);

    const getDayOfWeekFromDayId = dayId => {
      const daysMap = {
        monday: 0,
        tuesday: 1,
        wednesday: 2,
        thursday: 3,
        friday: 4,
        saturday: 5,
        sunday: 6,
      };
      const day = dayId.split('_')[1].toLowerCase();
      return daysMap[day];
    };

    const generateScheduleId = shift => {
      return `${dayId}_${shift}`;
    };

    const onShiftChange = e => {
      const newShift = e.target.value;
      const newId = generateScheduleId(newShift);
      setScheduleId(newId);
      form.setFieldsValue({ id: newId });
    };

    useEffect(() => {
      const dayOfWeek = getDayOfWeekFromDayId(dayId);
      form.setFieldsValue({ dayOfWeek });
    }, [dayId, form]);

    const onFinish = values => {
      if (data?.id) {
        const updatedValues = {};
        Object.keys(values).forEach(key => {
          if (values[key] !== data[key]) {
            updatedValues[key] = values[key];
          }
        });

        api
          .updateWorkSchedule(data.id, updatedValues)
          .then(response => {
            onSuccess?.();
            modal.hide();
          })
          .catch(error => {
            console.log('Update workSchedule error', error);
            messageApi.error(
              error?.response?.data?.message || 'Lỗi khi cập nhật lịch làm',
            );
          });
      } else {
        api
          .createWorkSchedule(values)
          .then(response => {
            onSuccess?.();
            modal.hide();
          })
          .catch(error => {
            console.log('Add workSchedule error', error);
            if (
              error?.response?.data?.message ===
              'WorkSchedule is already exists'
            ) {
              messageApi.error('Lịch làm đã tồn tại');
            } else {
              messageApi.error('Lỗi khi thêm lịch làm');
            }
          });
      }
    };

    return (
      <Modal
        title={data?.id ? 'Chỉnh sửa lịch làm' : 'Thêm lịch làm'}
        open={modal.visible}
        onCancel={modal.hide}
        afterClose={modal.remove}
        footer={[
          <Button key="cancel" onClick={modal.hide}>
            Hủy
          </Button>,
          <Button form="add-form" key="submit" htmlType="submit" type="primary">
            {data?.id ? 'Cập nhật' : 'Thêm'}
          </Button>,
        ]}
      >
        <CustomForm
          form={form}
          id="add-form"
          onFinish={onFinish}
          autoComplete="off"
          labelCol={{ span: 6 }}
        >
          <Form.Item
            name="id"
            label="Mã lịch làm"
            rules={[
              { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
            ]}
            initialValue={data?.id || scheduleId}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="department"
            label="Chuyên khoa"
            rules={[
              { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
            ]}
            initialValue={departmentId || null}
          >
            <Select
              allowClear
              placeholder="Chọn chuyên khoa"
              options={departments}
              disabled={departmentId}
            />
          </Form.Item>
          <Form.Item
            name="employee"
            label="Bác sĩ"
            rules={[
              { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
            ]}
            initialValue={data?.employeeData.id || null}
          >
            <Select allowClear placeholder="Chọn bác sĩ" options={employees} />
          </Form.Item>
          <Form.Item
            name="dayOfWeek"
            label="Thứ"
            rules={[
              { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
            ]}
          >
            <Select
              disabled
              options={[
                { label: 'Thứ 2', value: 0 },
                { label: 'Thứ 3', value: 1 },
                { label: 'Thứ 4', value: 2 },
                { label: 'Thứ 5', value: 3 },
                { label: 'Thứ 6', value: 4 },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="shift"
            label="Ca làm"
            rules={[
              { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
            ]}
            initialValue={data?.shift || null}
          >
            <Radio.Group onChange={onShiftChange} disabled={data?.shift}>
              <Radio value="morning">Sáng(7h30-11h30)</Radio>
              <Radio value="afternoon">Chiều(13h30-17h30)</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[
              { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
            ]}
            initialValue={data?.status || 'on'}
          >
            <Radio.Group>
              <Radio value="on">Làm bình thường</Radio>
              <Radio value="off">Nghỉ</Radio>
            </Radio.Group>
          </Form.Item>
        </CustomForm>
      </Modal>
    );
  },
);

export default AddWorkSchedule;
