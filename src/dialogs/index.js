import NiceModal from '@ebay/nice-modal-react';

import AddRole from './admin/AddRole';
import AddEmployee from './admin/AddEmployee';
import AddDepartment from './admin/AddDepartment';
import AddUser from './manage/AddUser';
import AddWorkSchedule from './manage/AddWorkSchedule';
import AddMedication from './manage/AddMedication';
import AddPrescription from './manage/AddPrescription';

NiceModal.register('add-employee', AddEmployee);
NiceModal.register('add-role', AddRole);
NiceModal.register('add-department', AddDepartment);
NiceModal.register('add-user', AddUser);
NiceModal.register('add-schedule', AddWorkSchedule);
NiceModal.register('add-medication', AddMedication);
NiceModal.register('add-prescription', AddPrescription);
