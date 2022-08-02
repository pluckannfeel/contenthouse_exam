import { useSelector } from 'react-redux';

import useLatestEntity from './useLatestEntity';
import useThunkDispatch from './useThunkDispatch';

import * as companyActions from '@redux/modules/company';

function createCompany(params, dispatch) {
  const { createCompany: createFn } = companyActions;

  const id = Math.random().toString(36).substring(2, 9);
  const newCompany = {
    ...params,
    id,
    avatarUrl: '/static/mock-images/avatars/avatar_default.jpg',
  };

  return dispatch(createFn(newCompany));
}

function updateCompany(params, dispatch) {
  const { updateCompany: updateFn } = companyActions;

  return dispatch(updateFn(params));
}

function deleteCompany(params, dispatch) {
  const { deleteCompany: deleteFn } = companyActions;

  return dispatch(deleteFn(params));
}

const useCompany = (initCompany = {}) => {
  const { entity: company } = useLatestEntity(initCompany, 'companies');

  const dispatch = useThunkDispatch();

  const { creating, deleting, loading, updating } = useSelector(
    (reduxState) => reduxState.companies
  );

  return {
    company,
    callbacks: {
      updateCompany: (params) => updateCompany(params, dispatch),
      createCompany: (params) => createCompany(params, dispatch),
      deleteCompany: (params) => deleteCompany(params, dispatch),
    },
    creating,
    deleting,
    loading,
    updating,
  };
};

export default useCompany;
