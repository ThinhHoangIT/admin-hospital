import { useEffect, useMemo } from 'react';
import { Dropdown, Empty, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import styled from 'styled-components';

import { APP_MENU } from '@/commons/constants';
import { AppLayout, MenuSider, Name, User } from './styles';
import {
  clearAllState,
  selectCurrentMenu,
  selectCurrentUser,
  selectIsPermission,
  setUserRoleFeatures,
} from '@/store/app';
import colors from '@/theme/color';
import storage from '@/storage';

import AppMenu from '@/components/AppMenu';
import AppSider from '@/components/AppSider';

import Role from '../admin/role';
import Employee from '../admin/employee';
import Department from '../admin/department';
import Patient from '../manage/patient';
import WorkSchedule from '../manage/work-schedule';
import Appointment from '../manage/appointment';
import Medication from '../manage/medication';
import Invoice from '../manage/invoice';
import api from '@/services/api';

const EmptyLayout = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const getContentLayout = key => {
  switch (key) {
    // UI

    // MANAGE
    case APP_MENU.MANAGE_PATIENT:
      return <Patient />;
    case APP_MENU.MANAGE_APPOINTMENT:
      return <Appointment />;
    case APP_MENU.MANAGE_MEDICINE:
      return <Medication />;
    case APP_MENU.MANAGE_INVOICE:
      return <Invoice />;

    case APP_MENU.MANAGE_SCHEDULE_ENT:
      return <WorkSchedule departmentId={'ent'} />;
    case APP_MENU.MANAGE_SCHEDULE_DENTAL:
      return <WorkSchedule departmentId={'dental'} />;
    case APP_MENU.MANAGE_SCHEDULE_DERMATOLOGY:
      return <WorkSchedule departmentId={'dermatology'} />;
    case APP_MENU.MANAGE_SCHEDULE_HEART:
      return <WorkSchedule departmentId={'heart'} />;
    case APP_MENU.MANAGE_SCHEDULE_PEDIATRICS:
      return <WorkSchedule departmentId={'pediatrics'} />;

    // ADMIN
    case APP_MENU.ADMIN_ROLE:
      return <Role />;
    case APP_MENU.ADMIN_EMPLOYEE:
      return <Employee />;
    case APP_MENU.ADMIN_DEPARTMENT:
      return <Department />;

    default:
      return (
        <EmptyLayout>
          <Empty description={false} />
        </EmptyLayout>
      );
  }
};

const Home = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const currentUser = useSelector(selectCurrentUser);
  const currentMenu = useSelector(selectCurrentMenu);

  const userDropdown = useMemo(
    () => ({
      items: [
        { key: 'personal', label: 'Thông tin cá nhân' },
        {
          key: 'logout',
          label: 'Đăng xuất',
          onClick: () => {
            storage.removeUser();
            dispatch(clearAllState());
          },
        },
      ],
    }),
    [],
  );

  const isPermission = useSelector(selectIsPermission);

  console.log(currentUser);

  useEffect(() => {
    if (!currentMenu) {
      return;
    }
    if (!isPermission) {
      messageApi.warning('Bạn không có quyền truy cập');
    }
  }, [currentMenu]);

  useEffect(() => {
    api
      .getRole(currentUser?.role)
      .then(response => {
        dispatch(setUserRoleFeatures(response.data));
      })
      .catch(error => {
        console.log('Get role error', error);
      });
  }, []);

  return (
    <AppLayout>
      <AppSider />
      <MenuSider>
        <Dropdown menu={userDropdown}>
          <User>
            <div className="row">
              <FaUserCircle color={colors.primary} size={24} />
              <Name>{currentUser?.name}</Name>
            </div>
            <FaChevronDown color={colors.lightGray} size={12} />
          </User>
        </Dropdown>
        <AppMenu />
      </MenuSider>
      {isPermission && getContentLayout(currentMenu)}
    </AppLayout>
  );
};

export default Home;
