import axios from 'axios';
import { API_URL } from '@/commons/constants';
import storage from '@/storage';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  config => {
    const user = storage.getUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    console.log('Request: ', config);
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = storage.getUser();
      const refreshToken = user ? user.refreshToken : null;
      return axios
        .post(API_URL + '/employees/auth/refresh-token', { refreshToken })
        .then(res => {
          if (res.status === 201) {
            user.token = res.data.token;
            storage.setUser(user);
            originalRequest.headers['Authorization'] =
              'Bearer ' + res.data.token;
            return api(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  },
);

api.login = async (phone, password) => {
  const response = await api
    .post('/employees/auth/login', { phone, password })
    .catch(console.log);
  if (response.success) {
    const user = response.data;
    storage.setUser(user);
  }
  return response;
};

api.loginWithRefreshToken = async refreshToken => {
  const response = await api
    .post('/employees/auth/refresh-token', { refreshToken })
    .catch(console.log);
  if (response.success) {
    const user = response.data;
    storage.setUser(user);
  }
  return response;
};

// Users
api.getUsers = async params => {
  return api.get('/users', { params });
};
api.getUser = async id => {
  return api.get(`/users/${id}`);
};
api.createUser = async user => {
  return api.post('/users', user);
};
api.updateUser = async (id, user) => {
  return api.put(`/users/${id}`, user);
};
api.deleteUser = async id => {
  return api.delete(`/users/${id}`);
};
api.updateUserStatus = async (id, status) => {
  return api.put(`/users/update-status/${id}`, status);
};

// Employees
api.getEmployees = async params => {
  return api.get('/employees', { params });
};
api.getEmployee = async id => {
  return api.get(`/employees/${id}`);
};
api.createEmployee = async employee => {
  return api.post('/employees', employee);
};
api.updateEmployee = async (id, employee) => {
  return api.put(`/employees/${id}`, employee);
};
api.deleteEmployee = async id => {
  return api.delete(`/employees/${id}`);
};
api.getEmployeesLogs = async () => {
  return api.get('/logs/collection?tableName=Employee');
};

// Roles
api.getRoles = async params => {
  return api.get('/roles', { params });
};
api.getRole = async id => {
  return api.get(`/roles/${id}`);
};
api.createRole = async role => {
  return api.post('/roles', role);
};
api.updateRole = async (id, role) => {
  return api.put(`/roles/${id}`, role);
};
api.deleteRole = async id => {
  return api.delete(`/roles/${id}`);
};
api.getRolesLogs = async () => {
  return api.get('/logs/collection?tableName=Role');
};

// Departments
api.getDepartments = async params => {
  return api.get('/departments', { params });
};
api.getDepartment = async id => {
  return api.get(`/departments/${id}`);
};
api.createDepartment = async department => {
  return api.post('/departments', department);
};
api.updateDepartment = async (id, department) => {
  return api.put(`/departments/${id}`, department);
};
api.deleteDepartment = async id => {
  return api.delete(`/departments/${id}`);
};
api.getDepartmentsLogs = async () => {
  return api.get('/logs/collection?tableName=Department');
};

// WorkSchedules
api.getWorkSchedules = async params => {
  return api.get('/schedules', { params });
};
api.getWorkSchedule = async id => {
  return api.get(`/schedules/${id}`);
};
api.createWorkSchedule = async department => {
  return api.post('/schedules', department);
};
api.updateWorkSchedule = async (id, department) => {
  return api.put(`/schedules/${id}`, department);
};
api.deleteWorkSchedule = async id => {
  return api.delete(`/schedules/${id}`);
};
api.getWorkSchedulesLogs = async () => {
  return api.get('/logs/collection?tableName=WorkSchedule');
};

// Appointments
api.getAppointments = async params => {
  return api.get('/appointments', { params });
};
api.updateAppointmentStatus = async (id, status) => {
  return api.put(`/appointments/update-status/${id}`, status);
};

// Medications
api.getMedications = async params => {
  return api.get('/medications', { params });
};
api.getMedication = async id => {
  return api.get(`/medications/${id}`);
};
api.createMedication = async medication => {
  return api.post('/medications', medication);
};
api.updateMedication = async (id, medication) => {
  return api.put(`/medications/${id}`, medication);
};
api.deleteMedication = async id => {
  return api.delete(`/medications/${id}`);
};
api.getMedicationsLogs = async () => {
  return api.get('/logs/collection?tableName=Medication');
};

// Invoices
api.getInvoices = async params => {
  return api.get('/invoices', { params });
};
api.getInvoice = async id => {
  return api.get(`/invoices/${id}`);
};
api.createInvoice = async invoice => {
  return api.post('/invoices', invoice);
};
api.updateInvoice = async (id, invoice) => {
  return api.put(`/invoices/${id}`, invoice);
};

export default api;
