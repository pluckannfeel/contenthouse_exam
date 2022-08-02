import * as users from './user';
import * as companies from './company';
import * as entities from '../entities';

const modules = {
  entities,
  users,
  companies,
};

export const reducers = Object.keys(modules).reduce((acc, moduleKey) => {
  const module = modules[moduleKey];
  acc[moduleKey] = module.default;

  return acc;
}, {});

export default modules;
