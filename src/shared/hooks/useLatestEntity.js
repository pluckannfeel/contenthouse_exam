import { useSelector } from 'react-redux'

function useLatestEntity(initEntity, entityKey){
  const { id } = initEntity

  const entities = useSelector(reduxState => reduxState.entities[entityKey])

  const inStore = id && entities[id]
  const entity = inStore ? entities[id] : initEntity

  return {
    entity,
    isLatest: inStore,
  }
}

export default useLatestEntity
