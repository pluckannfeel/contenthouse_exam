import cloneDeep from 'lodash/cloneDeep'
import deepmerge from 'deepmerge'

const DELETE_ENTITY = 'contenthouse/entity/DELETE_ENTITY'
const REPLACE_ENTITY = 'contenthouse/entity/REPLACE_ENTITY'
const UPDATE_ENTITY = 'contenthouse/entity/UPDATE_ENTITY'

const initialState = {
  _updates: {},
  users: {},
}

export function updateEntities(payload, options = {}){
  return { type: UPDATE_ENTITY, ...payload.entities, _options: options }
}

export function replaceEntity(payload){
  return { type: REPLACE_ENTITY, ...payload.entities }
}

export function deleteEntity(payload){
  return { type: DELETE_ENTITY, ...payload.entities }
}

function cleanKeys(keys = [], removeKeys = []){
  const updatedKeys = [...keys].filter(key => removeKeys.indexOf(key) === -1)

  return updatedKeys
}

function removeStaleEntities(currentEntityState, actionEntityState){
  const currentKeys = Object.keys(currentEntityState)
  const actionKeys = Object.keys(actionEntityState)

  const updatedActionEntityState = cloneDeep(actionEntityState)

  actionKeys.forEach((actionKey) => {
    // If we already have the key, we need to check if the next one
    // is newer using cache key
    if (currentKeys.includes(actionKey)){
      const actionEntity = updatedActionEntityState[actionKey]
      const currentEntity = currentEntityState[actionKey]

      // Remove the entity from actionEntityState if it is older
      // than the one we already have in state
      if (
        typeof actionEntity === 'object'
        && actionEntity !== null
        && actionEntity.cache_key
        && currentEntity.cache_key
        && actionEntity.cache_key < currentEntity.cache_key
      ){
        delete updatedActionEntityState[actionKey]
      }
    }
  })

  return updatedActionEntityState
}

function mergeEntities(entityKeys, currentState, action, options = {}){
  const updatedState = cloneDeep(currentState)

  // Don't merge arrays
  const useSourceFn = (_, source) => source
  const mergeOptions = {
    arrayMerge: useSourceFn,
    ...options.mergeOptions,
  }

  entityKeys.forEach((entityKey) => {
    const currentEntityState = updatedState[entityKey]
    const actionEntityState = action[entityKey]

    const updatedActionEntityState = removeStaleEntities(currentEntityState, actionEntityState)

    updatedState[entityKey] = deepmerge(currentEntityState, updatedActionEntityState, mergeOptions)
  })

  return updatedState
}

export function digObject(target, keyString, defaultValue){
    const keys = keyString.split('.')

    const value = keys.reduce(
      (acc, key) => {
        const accValue = typeof acc === 'undefined' || acc === null ? acc : acc[key]
        return accValue
      },
      { ...target },
    )

    if (value === null || value === undefined) return defaultValue

    return value
  }

// Reducers
function addEntities(state, action){
  const options = digObject(action, '_options', {})

  const keys = cleanKeys(Object.keys(action), ['type', '_options'])

  const updatedState = mergeEntities(keys, state, action, options)

  return updatedState
}

function replaceEntities(state, action){
  const keys = cleanKeys(Object.keys(action), ['type'])
  const newState = cloneDeep(state)

  keys.forEach((key) => {
    if (newState[key]){
      newState[key] = cloneDeep(state[key])

      // Keys of the item we need to replace
      const itemKeys = Object.keys(action[key])
      itemKeys.forEach((itemKey) => {
        newState[key][itemKey] = action[key][itemKey]
      })
    }
  })

  return newState
}

function removeEntities(state, action){
  const keys = cleanKeys(Object.keys(action), ['type'])
  const newState = cloneDeep(state)

  keys.forEach((key) => {
    if (newState[key]){
      newState[key] = cloneDeep(state[key])

      // Keys of the item we need to remove
      const itemKeys = Object.keys(action[key])
      itemKeys.forEach((itemKey) => {
        delete newState[key][itemKey]
      })
    }
  })

  return newState
}

export default function reducer(state = initialState, action = {}){
  switch (action.type){
    case UPDATE_ENTITY:
      return addEntities(state, action)
    case REPLACE_ENTITY:
      return replaceEntities(state, action)
    case DELETE_ENTITY:
      return removeEntities(state, action)
    default:
      return state
  }
}
