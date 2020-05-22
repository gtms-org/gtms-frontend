import {
  fetchPromotedTagsAPI,
  deletePromotedTagAPI,
  createPromotedTagAPI,
  updatePromotedTagAPI,
} from '@gtms/api-tags'
import { promotedTagsStore } from './promotedTags.store'
import { promotedTagsQuery } from './promotedTags.query'
import { parseFiles } from '@gtms/commons/helpers'
import { FileStatus } from '@gtms/commons/enums'
import {
  addSuccessNotification,
  addErrorNotification,
} from '@gtms/state-notification'

export const loadGroupPromotedTags = async (id: string) => {
  promotedTagsStore.setLoading(true)
  promotedTagsStore.setError(false)

  try {
    const promoted = await fetchPromotedTagsAPI(id)
    promotedTagsStore.upsertMany(
      promoted.map((p) => {
        if (p.logo?.status === FileStatus.ready) {
          p.logo.files = parseFiles((p.logo.files as any) || [])
        }

        return p
      })
    )
  } catch {
    promotedTagsStore.setError(true)
  } finally {
    promotedTagsStore.setLoading(false)
  }
}

export const createPromotedTag = async (data: {
  tag: string
  group: string
  description: string
}) => {
  try {
    const result = await createPromotedTagAPI(data)

    addSuccessNotification(`You promoted tag #${data.tag} has been created!`)

    promotedTagsStore.upsert(result.id as any, result)

    return result
  } catch {
    addErrorNotification('Error occured, try again later')
  }
}

export const updatePromotedTag = async (
  id: string,
  data: {
    description: string
    order?: number
  }
) => {
  try {
    const result = await updatePromotedTagAPI(id, data)
    const promoted = promotedTagsQuery.getEntity(id as any)

    addSuccessNotification(`Promoted tag has been updated!`)

    if (promoted) {
      promotedTagsStore.update(id as any, result)
    }
  } catch {
    addErrorNotification('Error occured, try again later')
  }
}

export const deletePromotedTag = async (id: string) => {
  try {
    await deletePromotedTagAPI(id)

    addSuccessNotification(`Promoted tag has been removed`)

    promotedTagsStore.remove((p) => {
      return p.id === id
    })
  } catch (err) {
    addErrorNotification('Error occured, try again later')
  }
}