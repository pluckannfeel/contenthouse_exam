import { schema } from 'normalizr';

const user = new schema.Entity('users');
const company = new schema.Entity('companies');

export const Schemas = {
  USER: user,
  USER_ARRAY: [user],
  COMPANY: company,
  COMPANY_ARRAY: [company],
};

export default Schemas;
