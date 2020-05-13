import { Store } from '@datorama/akita'
import { IGroup } from '@gtms/commons'

export interface IGroupStore {
  isLoading: boolean
  hasNoAccess: boolean
  notFound: boolean
  errorOccured: boolean
  group: IGroup | null
}

export class GroupsStore extends Store<IGroupStore> {
  constructor() {
    super(
      {
        isLoading: true,
        hasNoAccess: false,
        notFound: false,
        errorOccured: false,
        group: null,
      },
      {
        name: 'groups',
      }
    )
  }
}

export const groupStore = new GroupsStore()
