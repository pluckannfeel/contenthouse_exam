import { schema } from 'normalizr'

const user = new schema.Entity('users')

export const Schemas = {
  USER: user,
  USER_ARRAY: [user],
}

export default Schemas
