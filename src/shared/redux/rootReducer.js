import { combineReducers } from 'redux'

import { reducers } from './modules/index'

const createRootReducer = () => combineReducers({
  ...reducers,
})

export default createRootReducer
