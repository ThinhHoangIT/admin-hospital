export const API_URL = 'http://localhost:7000/api';

export const APP_MODULES = {
  UI: 'ui',
  MANAGE: 'manage',
  ADMIN: 'admin',
};

export const APP_MENU = {
  // UI
  UI_DASHBOARD: 'ui_dashboard',
  // Manage
  MANAGE_SCHEDULE: 'manage_schedule',
  MANAGE_SCHEDULE_ENT: 'manage_schedule_ent',
  MANAGE_SCHEDULE_DENTAL: 'manage_schedule_dental',
  MANAGE_SCHEDULE_DERMATOLOGY: 'manage_schedule_dermatology',
  MANAGE_SCHEDULE_HEART: 'manage_schedule_heart',
  MANAGE_SCHEDULE_PEDIATRICS: 'manage_schedule_pediatrics',
  MANAGE_MEDICINE: 'manage_medicine',
  MANAGE_PATIENT: 'manage_patient',
  MANAGE_APPOINTMENT: 'manage_appointment',
  MANAGE_INVOICE: 'manage_invoice',
  // Admin
  ADMIN_EMPLOYEE: 'admin_employee',
  ADMIN_ROLE: 'admin_role',
  ADMIN_DEPARTMENT: 'admin_department',
};

export const DEPARTMENT_MENU = {
  ENT: 'ent', // tai mũi họng
  DENTAL: 'dental', // nha khoa
  DERMATOLOGY: 'dermatology', // da liễu
  HEART: 'heart', // tim mạch
  PEDIATRICS: 'pediatrics', // nhi khoa
};

export const ROLE_FEATURES = {
  ADMIN: 'admin',

  // MANAGE
  MANAGE_PATIENT: 'manage_patient',
  MANAGE_SCHEDULE: 'manage_schedule',
  MANAGE_MEDICINE: 'manage_medicine',
  MANAGE_DOCTOR: 'manage_doctor',
  MANAGE_APPOINTMENT: 'manage_appointment',
  MANAGE_INVOICE: 'manage_invoice',
};

export const USER_STATUSES = {
  ACTIVE: 'active',
  DEACTIVE: 'deactive',
};
