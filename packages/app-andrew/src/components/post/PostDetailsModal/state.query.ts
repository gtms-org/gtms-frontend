import { Observable, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { IAccountDetails, IComment } from '@gtms/commons/models'
import { postDetailsQuery, IPostDetailsState } from '@app/state/postDetails'
import { postCommentsQuery } from '@gtms/state-comment'
import { userQuery } from '@gtms/state-user'

export interface IPostDetailsModalState extends IPostDetailsState {
  user: IAccountDetails | null
  comments?: {
    comments: IComment[]
    errorOccured: boolean
    isLoading: boolean
    limit: number
    offset: number
    total: number
  }
}

export const postDetailsModalState = (): IPostDetailsModalState => {
  const comments = postCommentsQuery.getValue()
  return {
    ...postDetailsQuery.getValue(),
    user: userQuery.isLogged() ? userQuery.accountDetails() : null,
    comments: {
      comments: postCommentsQuery.getAll(),
      errorOccured: comments.error ?? false,
      isLoading: comments.loading ?? false,
      limit: 50,
      total: comments.total,
      offset: comments.offset,
    },
  }
}

export const postDetailsModalState$: Observable<IPostDetailsModalState> = combineLatest(
  [
    userQuery.accountDetails$,
    postDetailsQuery.select(),
    postCommentsQuery.select(),
  ]
).pipe(map(() => postDetailsModalState()))
