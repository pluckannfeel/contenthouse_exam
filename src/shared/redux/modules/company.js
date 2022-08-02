import { normalize } from 'normalizr';
import { Schemas } from '../schema';
import { deleteEntity, updateEntities } from '../entities';

import companies from '../../_mock/companies';

const FETCH_REQUEST = 'contenthouse/companies/FETCH_REQUEST';
const FETCH_SUCCESS = 'contenthouse/companies/FETCH_SUCCESS';
const FETCH_FAILURE = 'contenthouse/companies/FETCH_FAILURE';

const CREATE_REQUEST = 'contenthouse/companies/CREATE_REQUEST';
const CREATE_SUCCESS = 'contenthouse/companies/CREATE_SUCCESS';
const CREATE_FAILURE = 'contenthouse/companies/CREATE_FAILURE';

const UPDATE_REQUEST = 'contenthouse/companies/UPDATE_REQUEST';
const UPDATE_SUCCESS = 'contenthouse/companies/UPDATE_SUCCESS';
const UPDATE_FAILURE = 'contenthouse/companies/UPDATE_FAILURE';

const DELETE_REQUEST = 'contenthouse/companies/DELETE_REQUEST';
const DELETE_SUCCESS = 'contenthouse/companies/DELETE_SUCCESS';
const DELETE_FAILURE = 'contenthouse/companies/DELETE_FAILURE';

const initialState = {
  creating: false,
  deleting: false,
  errors: [],
  loaded: false,
  loading: false,
  updating: false,
};

// Actions
export function fetchRequest() {
  return {
    type: FETCH_REQUEST,
  };
}

export function fetchSuccess() {
  return {
    type: FETCH_SUCCESS,
  };
}

export function fetchFailure(errors = []) {
  return {
    type: FETCH_FAILURE,
    errors,
  };
}

export function createRequest() {
  return {
    type: CREATE_REQUEST,
  };
}

export function createSuccess() {
  return {
    type: CREATE_SUCCESS,
  };
}

export function createFailure(errors = []) {
  return {
    type: CREATE_FAILURE,
    errors,
  };
}

export function updateRequest() {
  return {
    type: UPDATE_REQUEST,
  };
}

export function updateSuccess() {
  return {
    type: UPDATE_SUCCESS,
  };
}

export function updateFailure(errors = []) {
  return {
    type: UPDATE_FAILURE,
    errors,
  };
}

export function deleteRequest() {
  return {
    type: DELETE_REQUEST,
  };
}

export function deleteSuccess() {
  return {
    type: DELETE_SUCCESS,
  };
}

export function deleteFailure(errors = []) {
  return {
    type: DELETE_FAILURE,
    errors,
  };
}

export function loadCompanies() {
  return (dispatch) => {
    dispatch(fetchRequest());

    const promise = new Promise((resolve, reject) => {
      if (!companies.length) reject(new Error('No data'));

      resolve({ data: companies });
    });

    promise.then(({ data }) => {
      const normalizedJson = normalize(data, Schemas.COMPANY_ARRAY);
      dispatch(updateEntities(normalizedJson));
      dispatch(fetchSuccess());
      return { success: true, data };
    });

    promise.catch((data) => {
      const errors = data;
      dispatch(fetchFailure(errors));

      return { success: false, result: errors };
    });

    return promise;
  };
}

export function createCompany(company) {
  return (dispatch) => {
    dispatch(createRequest());

    const promise = new Promise((resolve, reject) => {
      if (!company) reject(new Error('No data'));

      resolve({ data: company });
    });

    promise.then(({ data }) => {
      const normalizedJson = normalize(data, Schemas.COMPANY);
      dispatch(updateEntities(normalizedJson));
      dispatch(createSuccess());

      return { success: true, data };
    });

    promise.catch((data) => {
      const errors = data;
      dispatch(createFailure(errors));

      return { success: false, result: errors };
    });

    return promise;
  };
}

export function updateCompany(company) {
  return (dispatch) => {
    dispatch(updateRequest());

    const promise = new Promise((resolve, reject) => {
      if (!company) reject(new Error('No data'));

      resolve({ data: company });
    });

    promise.then(({ data }) => {
      const normalizedJson = normalize(data, Schemas.COMPANY);
      dispatch(updateEntities(normalizedJson));
      dispatch(updateSuccess());

      return { success: true, data };
    });

    promise.catch((data) => {
      const errors = data;
      dispatch(updateFailure(errors));

      return { success: false, result: errors };
    });

    return promise;
  };
}

export function deleteCompany(company) {
  return (dispatch) => {
    dispatch(deleteRequest());

    const promise = new Promise((resolve, reject) => {
      if (!company) reject(new Error('No data'));

      resolve({ data: company });
    });

    promise.then(({ data }) => {
      console.log(data);
      const normalizedJson = normalize(data, Schemas.COMPANY);

      dispatch(deleteEntity(normalizedJson));
      dispatch(deleteSuccess());

      return { success: true, data };
    });

    promise.catch((data) => {
      const errors = data;
      dispatch(deleteFailure(errors));

      return { success: false, result: errors };
    });

    return promise;
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        errors: [],
      };
    case FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        errors: action.errors,
      };
    case CREATE_REQUEST:
      return {
        ...state,
        creating: true,
      };
    case CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        errors: [],
      };
    case CREATE_FAILURE:
      return {
        ...state,
        creating: false,
        errors: action.errors,
      };
    case UPDATE_REQUEST:
      return {
        ...state,
        updating: true,
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        errors: [],
      };
    case UPDATE_FAILURE:
      return {
        ...state,
        updating: false,
        errors: action.errors,
      };
    case DELETE_REQUEST:
      return {
        ...state,
        deleting: true,
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        errors: [],
      };
    case DELETE_FAILURE:
      return {
        ...state,
        deleting: false,
        errors: action.errors,
      };
    default:
      return state;
  }
}
