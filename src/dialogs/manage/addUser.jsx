import { Modal, Button, Form, Input, DatePicker, Radio } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import api from '@/services/api';
import dayjs from 'dayjs';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const AddUser = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();

  const onFinish = values => {
    if (data?.id) {
      const updatedValues = {};
      Object.keys(values).forEach(key => {
        if (values[key] !== data[key]) {
          updatedValues[key] = values[key];
        }
      });

      api
        .updateUser(data.id, updatedValues)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Update user error', error);
          if (error?.response?.data?.message === 'User is already exists') {
            messageApi.error('Mã bệnh nhân đã tồn tại');
          } else {
            messageApi.error('Lỗi khi cập nhật bệnh nhân');
          }
        });
    } else {
      api
        .createUser(values)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Add user error', error);
          if (error?.response?.data?.message === 'User is already exists') {
            messageApi.error('Mã bệnh nhân đã tồn tại');
          } else {
            messageApi.error('Lỗi khi thêm bệnh nhân');
          }
        });
    }
  };

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa bệnh nhân' : 'Thêm bệnh nhân'}
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
        id="add-form"
        onFinish={onFinish}
        autoComplete="off"
        labelCol={{ span: 6 }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
          initialValue={data?.email || ''}
        >
          <Input
            placeholder="Ví dụ: abc@gmail.com"
            autoComplete="nope"
            spellCheck={false}
            type="email"
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên bệnh nhân"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.name || ''}
        >
          <Input
            placeholder="Ví dụ: Lê Văn A, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.phone || ''}
        >
          <Input
            placeholder="Ví dụ: 0123456789"
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.address || ''}
        >
          <Input.TextArea
            placeholder="Ví dụ: 123 đường ABC, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="birthday"
          label="Ngày sinh"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={dayjs(data?.birthday) || ''}
        >
          <DatePicker
            allowClear
            showTime
            format={'DD/MM/YYYY'}
            placeholder={'Ngày sinh'}
          />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue
        >
          <Radio.Group>
            <Radio value={'male'}>Nam</Radio>
            <Radio value={'female'}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
        >
          <Input.Password
            autoComplete="new-password"
            placeholder="Ví dụ: 123456"
            allowClear
          />
        </Form.Item>
      </CustomForm>
    </Modal>
  );
});

export default AddUser;
