import React, { FC, useState, useEffect, useCallback } from 'react'
import { PromotedTagNoImage } from 'enums'
import { IPromotedTag } from '@gtms/commons/models'
import { FavTagType } from '@gtms/commons/enums'
// state
import {
  loadGroupPromotedTags,
  reloadGroupPromotedTagsSilently,
  deletePromotedTag,
  addTagToFavs,
} from '@gtms/state-tag'
import {
  IPromotedTagsState,
  promotedTagsState,
  promotedTagsState$,
} from './state.query'
// components
import { PromotedTagsForm } from 'components/group-settings/PromotedTagForm'
// ui
import { EmptyPromotedTags } from '@gtms/ui/EmptyPromotedTags'
import { Modal } from '@gtms/ui/Modal'
import { PromotedTags as PromotedTagsUI } from '@gtms/ui/PromotedTags'

export const PromotedTags: FC<{
  additionalStyles?: string
  onTagClick?: (tag: IPromotedTag) => unknown
}> = ({ additionalStyles, onTagClick }) => {
  const [state, setState] = useState<IPromotedTagsState>(promotedTagsState())
  const [promotedTagEditor, setPromotedTagEditor] = useState<{
    isOpen: boolean
    id?: string
    description?: string
    tag?: string
  }>({
    isOpen: false,
  })

  const onAddTagClick = useCallback(() => {
    setPromotedTagEditor({
      isOpen: true,
    })
  }, [])

  const onEditTagClick = useCallback((tag: IPromotedTag) => {
    setPromotedTagEditor({
      isOpen: true,
      description: tag.description,
      id: tag.id,
      tag: tag.tag,
    })
  }, [])

  const onDeleteTagClick = useCallback((tag: IPromotedTag) => {
    // todo show confirmation first!
    deletePromotedTag(tag.id)
  }, [])

  const onFavClick = useCallback(
    (tag: IPromotedTag, checked: boolean) => {
      if (!state.id) {
        return
      }

      addTagToFavs(tag, state.id)
    },
    [state.id]
  )

  useEffect(() => {
    const sub = promotedTagsState$.subscribe((value) => setState(value))

    if (
      !state.isLoading &&
      !state.errorOccured &&
      state.tags.length === 0 &&
      state.id
    ) {
      loadGroupPromotedTags(state.id as string)
    }

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  return (
    <div className={additionalStyles}>
      {state.isAdmin && !state.isLoading && state.tags.length === 0 && (
        <EmptyPromotedTags onAddClick={onAddTagClick} />
      )}
      {state.isLoading ||
        (state.tags.length > 0 && (
          <PromotedTagsUI
            onFavClick={onFavClick}
            activeTags={state.activeTags}
            isAdmin={state.isAdmin}
            isLoading={state.isLoading}
            noImage={PromotedTagNoImage}
            onDeleteRecordClick={onDeleteTagClick}
            onEditRecordClick={onEditTagClick}
            onNoRecordsClick={onAddTagClick}
            onTagClick={onTagClick}
            tags={state.tags}
          />
        ))}
      {promotedTagEditor.isOpen && (
        <Modal
          onClose={() => {
            setPromotedTagEditor({
              isOpen: false,
            })
          }}
        >
          <PromotedTagsForm
            description={promotedTagEditor.description}
            groupId={state.id || ''}
            id={promotedTagEditor.id}
            onSuccess={() => {
              setPromotedTagEditor({
                isOpen: false,
              })

              setTimeout(
                () => reloadGroupPromotedTagsSilently(state.id || ''),
                2000
              )
            }}
            tag={promotedTagEditor.tag}
          />
        </Modal>
      )}
    </div>
  )
}
