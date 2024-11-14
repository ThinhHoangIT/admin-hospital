import { Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { APP_MENU, APP_MODULES } from '@/commons/constants';
import { selectCurrentModule, setCurrentMenu } from '@/store/app';
import fonts from '@/theme/font';

const menuUIItems = [
  {
    key: 'ui',
    label: 'UI',
    children: [{ key: APP_MENU.UI_DASHBOARD, label: 'Dashboard' }],
    type: 'group',
  },
];

const menuManageItems = [
  {
    key: 'manage',
    label: 'Quản lý',
    children: [
      {
        key: APP_MENU.MANAGE_SCHEDULE,
        label: 'Lịch làm việc khoa',
        children: [
          { key: APP_MENU.MANAGE_SCHEDULE_ENT, label: 'Tai mũi họng' },
          { key: APP_MENU.MANAGE_SCHEDULE_DENTAL, label: 'Nha khoa' },
          { key: APP_MENU.MANAGE_SCHEDULE_DERMATOLOGY, label: 'Da liễu' },
          { key: APP_MENU.MANAGE_SCHEDULE_HEART, label: 'Tim mạch' },
          { key: APP_MENU.MANAGE_SCHEDULE_PEDIATRICS, label: 'Nhi khoa' },
        ],
      },
      {
        key: APP_MENU.MANAGE_APPOINTMENT,
        label: 'Lịch hẹn khám chữa bệnh',
      },
      { key: APP_MENU.MANAGE_MEDICINE, label: 'Thuốc' },
      {
        key: APP_MENU.MANAGE_PATIENT,
        label: 'Bệnh nhân',
      },
      { key: APP_MENU.MANAGE_INVOICE, label: 'Hóa đơn' },
    ],
    type: 'group',
  },
];

const menuAdminItems = [
  {
    key: 'admin',
    label: 'ADMIN',
    children: [
      { key: APP_MENU.ADMIN_EMPLOYEE, label: 'Bác sĩ' },
      { key: APP_MENU.ADMIN_ROLE, label: 'Vai trò' },
      { key: APP_MENU.ADMIN_DEPARTMENT, label: 'Chuyên khoa' },
    ],
    type: 'group',
  },
];

const CustomMenu = styled(Menu)({
  overflow: 'auto',
  '.ant-menu-item': {
    fontSize: 13,
  },
  '.ant-menu-item-selected': {
    fontFamily: fonts.Medium,
  },
});

const AppMenu = () => {
  const dispatch = useDispatch();

  const currentModule = useSelector(selectCurrentModule);

  const onClick = e => {
    dispatch(setCurrentMenu(e.key));
  };

  const getMenuData = () => {
    switch (currentModule) {
      case APP_MODULES.UI:
        return menuUIItems;
      case APP_MODULES.ADMIN:
        return menuAdminItems;
      case APP_MODULES.MANAGE:
        return menuManageItems;
    }
  };

  return (
    <CustomMenu
      defaultSelectedKeys={['product']}
      mode="inline"
      items={getMenuData()}
      onClick={onClick}
    />
  );
};

export default AppMenu;
