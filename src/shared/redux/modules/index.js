import * as users from './user'
import * as entities from '../entities'

const modules = {
    entities,
    users,
}

export const reducers = Object.keys(modules).reduce((acc, moduleKey) => {
    const module = modules[moduleKey]
    acc[moduleKey] = module.default

    return acc
}, {})

export default modules
