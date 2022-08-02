const loggableActionTypes = [
    'contenthouse/entity/UPDATE_ENTITY',
    'contenthouse/entity/DELETE_ENTITY',
  ]

  const lastModifiedMiddleware = () => next => (action) => {
    next(action)

    if (action && loggableActionTypes.includes(action.type)){
      const currentTimestamp = new Date().getTime()
      const updatedEntityKeys = Object.keys(action).filter(key => key !== 'type')

      const updatesAction = {
        type: 'contenthouse/entity/UPDATE_ENTITY',
        _updates: updatedEntityKeys.reduce((acc, key) => {
          acc[key] = currentTimestamp
          return acc
        }, {}),
      }

      next(updatesAction)
    }
  }

  export default lastModifiedMiddleware
