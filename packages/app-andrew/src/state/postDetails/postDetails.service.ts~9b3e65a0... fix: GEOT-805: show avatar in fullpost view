import { fetchPost } from '@gtms/api-post'
import { getPostComments } from '@gtms/state-comment'
import { postDetailsStore } from './postDetails.store'
import { Status } from './postDetails.model'

export function showPostDetailsModal(id: string, getPostOwner = false) {
  postDetailsStore.update({
    isOpen: true,
    status: Status.isLoading,

    post: undefined,
  })

  Promise.all([fetchPost(id, false, getPostOwner), getPostComments(id)])
    .then(([post]) => {
      postDetailsStore.update({
        isOpen: true,
        status: Status.isLoaded,

        post,
      })
    })
    .catch(() => {
      postDetailsStore.update({
        isOpen: true,
        status: Status.isError,
        post: undefined,
      })
    })
}

export function hidePostDetailsModal() {
  postDetailsStore.update({
    isOpen: false,
    status: Status.isLoading,
    post: undefined,
  })
}
