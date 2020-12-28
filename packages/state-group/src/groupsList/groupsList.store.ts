import { EntityState, EntityStore } from '@datorama/akita'
import { IGroup } from '@gtms/commons/models'
import { parseFiles } from '@gtms/commons/helpers'
import { FileStatus } from '@gtms/commons/enums'

export interface GroupsListState extends EntityState<IGroup, string> {
  offset: number
  limit: number
}

export class GroupsListStore extends EntityStore<GroupsListState> {
  constructor() {
    super(undefined, {
      name: 'groupsList',
      resettable: true,
    })
  }

  akitaPreAddEntity = (group: IGroup) => {
    if (
      group.avatar?.status === FileStatus.ready &&
      Array.isArray(group.avatar.files)
    ) {
      group.avatar.files = parseFiles(group.avatar.files)
    }

    return group
  }
}

export const groupsListStore = new GroupsListStore()
