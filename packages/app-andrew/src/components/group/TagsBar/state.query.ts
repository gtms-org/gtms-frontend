import { Observable, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { IPromotedTag } from '@gtms/commons/models'
import {
  promotedTagsQuery,
  IGroupRecentlyViewedTags,
  recentlyViewedTagsQuery,
} from '@gtms/state-tag'
import { groupQuery } from '@gtms/state-group'

export interface ITagsBarState {
  groupId?: string
  promoted: {
    isLoaded: boolean
    isLoading: boolean
    errorOccured: boolean
    tags: IPromotedTag[]
  }
  recentlyViewed: IGroupRecentlyViewedTags
}

export const tagsBarState = (): ITagsBarState => {
  const promotedTagsState = promotedTagsQuery.getValue()
  const groupId = groupQuery.getId()

  return {
    groupId,
    promoted: {
      isLoaded: promotedTagsState.isLoaded || false,
      isLoading: promotedTagsState.loading || false,
      errorOccured: promotedTagsState.error,
      tags: promotedTagsQuery.getAll(),
    },
    recentlyViewed: groupId
      ? recentlyViewedTagsQuery.getForGroup(groupId)
      : {
          isLoading: false,
          isLoaded: false,
          errorOccured: false,
          tags: [],
        },
  }
}

export const tagsBarState$: Observable<ITagsBarState> = combineLatest(
  promotedTagsQuery.selectAll(),
  recentlyViewedTagsQuery.select()
).pipe(map(() => tagsBarState()))
