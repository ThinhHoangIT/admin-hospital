import { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import api from '@/services/api';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const AddPrescription = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();
  const [medication, setMedication] = useState([]);

  useEffect(() => {
    api
      .getMedications()
      .then(response => {
        setMedication(
          response.data.map(medication => {
            medication.label = medication.name;
            medication.value = medication.id;
            return medication;
          }),
        );
      })
      .catch(error => {
        console.log('Get medications error', error);
      });
  }, []);

  const onFinish = values => {
    let amount = 0;
    if (values.medication) {
      values.medication.forEach(medId => {
        const med = medication.find(m => m.value === medId);
        if (med) {
          amount += med.price;
        }
      });
    }

    const dataSend = {
      user: data?.userId?._id,
      appointment: data?._id,
      medication: values.medication,
      amount,
      desc: values.desc,
    };

    api
      .createInvoice(dataSend)
      .then(response => {
        onSuccess?.();
        modal.hide();
      })
      .catch(error => {
        console.log('Add medication error', error);
        if (error?.response?.data?.message === 'Medication is already exists') {
          messageApi.error('Mã đơn thuốc đã tồn tại');
        } else {
          messageApi.error('Lỗi khi thêm đơn thuốc');
        }
      });
  };

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa đơn thuốc' : 'Thêm đơn thuốc'}
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
          name="name"
          label="Tên bệnh nhân"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.userId?.name || ''}
        >
          <Input autoComplete="nope" spellCheck={false} allowClear disabled />
        </Form.Item>
        <Form.Item
          name="medication"
          label="Toa thuốc"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.medication}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn toa thuốc"
            options={medication}
          />
        </Form.Item>
        <Form.Item name="desc" label="Bệnh án" initialValue={data?.desc || ''}>
          <Input.TextArea
            placeholder="Bệnh án"
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
      </CustomForm>
    </Modal>
  );
});

export default AddPrescription;
