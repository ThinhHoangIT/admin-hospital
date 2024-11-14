import { APP_MENU, APP_MODULES, ROLE_FEATURES } from './constants';

export const getMenuName = key => {
  switch (key) {
    // UI
    case APP_MENU.UI_DASHBOARD:
      return 'Theo dõi dashboard';

    // MANAGE
    case APP_MENU.MANAGE_SCHEDULE_ENT:
      return 'Lịch khám tai mũi họng';
    case APP_MENU.MANAGE_SCHEDULE_DENTAL:
      return 'Lịch khám nha khoa';
    case APP_MENU.MANAGE_SCHEDULE_DERMATOLOGY:
      return 'Lịch khám da liễu';
    case APP_MENU.MANAGE_SCHEDULE_HEART:
      return 'Lịch khám tim mạch';
    case APP_MENU.MANAGE_SCHEDULE_PEDIATRICS:
      return 'Lịch khám nhi khoa';
    case APP_MENU.MANAGE_APPOINTMENT:
      return 'Lịch hẹn khám chữa bệnh';
    case APP_MENU.MANAGE_INVOICE:
      return 'Hóa đơn';
    case APP_MENU.MANAGE_MEDICINE:
      return 'Quản lý thuốc';
    case APP_MENU.MANAGE_PATIENT:
      return 'Quản lý bệnh nhân';

    // ADMIN
    case APP_MENU.ADMIN_EMPLOYEE:
      return 'Quản lý bác sĩ';
    case APP_MENU.ADMIN_ROLE:
      return 'Quản lý vai trò';
    case APP_MENU.ADMIN_DEPARTMENT:
      return 'Quản lý chuyên khoa';
  }
};

export const getFeatureName = key => {
  switch (key) {
    case ROLE_FEATURES.ADMIN:
      return 'Admin - Đầy đủ tính năng';

    // ERP
    case ROLE_FEATURES.MANAGE_PATIENT:
      return 'Quản lý bệnh nhân';
    case ROLE_FEATURES.MANAGE_SCHEDULE:
      return 'Quản lý lịch khám';
    case ROLE_FEATURES.MANAGE_MEDICINE:
      return 'Quản lý thuốc';
    case ROLE_FEATURES.MANAGE_DOCTOR:
      return 'Quản lý bác sĩ';
    case ROLE_FEATURES.MANAGE_APPOINTMENT:
      return 'Quản lý lịch hẹn';
    case ROLE_FEATURES.MANAGE_INVOICE:
      return 'Quản lý hóa đơn';
  }
};

export const getModuleName = key => {
  switch (key) {
    case APP_MODULES.UI:
      return 'UI';
    case APP_MODULES.ADMIN:
      return 'Admin';
    case APP_MODULES.MANAGE:
      return 'Quản lý';
  }
};

export const getDepartmentName = key => {
  switch (key) {
    case 'ent':
      return 'Tai mũi họng';
    case 'dental':
      return 'Nha khoa';
    case 'dermatology':
      return 'Da liễu';
    case 'heart':
      return 'Tim mạch';
    case 'pediatrics':
      return 'Nhi khoa';
  }
};
