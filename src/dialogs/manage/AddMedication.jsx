import { Modal, Button, Form, Input } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import api from '@/services/api';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const AddMedication = NiceModal.create(({ data, onSuccess, messageApi }) => {
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
        .updateMedication(data.id, updatedValues)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Update medication error', error);
          if (
            error?.response?.data?.message === 'Medication is already exists'
          ) {
            messageApi.error('Mã thuốc đã tồn tại');
          } else {
            messageApi.error('Lỗi khi cập nhật thuốc');
          }
        });
    } else {
      api
        .createMedication(values)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Add medication error', error);
          if (
            error?.response?.data?.message === 'Medication is already exists'
          ) {
            messageApi.error('Mã thuốc đã tồn tại');
          } else {
            messageApi.error('Lỗi khi thêm thuốc');
          }
        });
    }
  };

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa thuốc' : 'Thêm thuốc'}
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
          name="id"
          label="Mã thuốc"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.id || ''}
        >
          <Input
            placeholder="Ví dụ: vp, x2, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
            disabled={data?.id}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên thuốc"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.name || ''}
        >
          <Input
            placeholder="Ví dụ: Panadol, Xianu, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item name="desc" label="Mô tả" initialValue={data?.desc || ''}>
          <Input.TextArea
            placeholder="Mô tả thuốc"
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá (VND)"
          initialValue={data?.price || ''}
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
        >
          <Input
            type="number"
            placeholder="Ví dụ: 10000, 20000, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
      </CustomForm>
    </Modal>
  );
});

export default AddMedication;
