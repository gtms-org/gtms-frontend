import { Query } from '@datorama/akita'
import { IPostDetailsState } from './postDetails.model'
import { PostDetailsStore, postDetailsStore } from './postDetails.store'

export class PostDetailsQuery extends Query<IPostDetailsState> {
  constructor(protected store: PostDetailsStore) {
    super(store)
  }
}

export const postDetailsQuery = new PostDetailsQuery(postDetailsStore)
