import { fetchJSON, makeApiUrl } from '@gtms/api-common'
import { IPost } from '@gtms/commons/models'

export const fetchPost = (id: string, group = false) =>
  fetchJSON<void, IPost>(makeApiUrl(`posts/${id}?group=${group ? '1' : '0'}`))
