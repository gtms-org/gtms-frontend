import { makeApiUrl } from '@gtms/api-common'

export const uploadGroupAvatar = (id: string, file: File) => {
  const data = new FormData()
  data.append('relatedRecord', id)
  data.append('file', file)

  return fetch(makeApiUrl(`files/groups/logo`), {
    method: 'POST',
    body: data,
  }).then((res) => {
    if (res.status !== 201) {
      throw res
    }
  })
}

export const uploadGroupBg = (id: string, file: File) => {
  const data = new FormData()
  data.append('relatedRecord', id)
  data.append('file', file)

  return fetch(makeApiUrl(`files/groups/bg`), {
    method: 'POST',
    body: data,
  }).then((res) => {
    if (res.status !== 201) {
      throw res
    }
  })
}

export const uploadGroupCover = (id: string, file: File) => {
  const data = new FormData()
  data.append('relatedRecord', id)
  data.append('file', file)

  return fetch(makeApiUrl(`files/groups/cover`), {
    method: 'POST',
    body: data,
  }).then((res) => {
    if (res.status !== 201) {
      throw res
    }
  })
}
