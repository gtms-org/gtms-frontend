import React, { FC, useState, useEffect, useCallback } from 'react'
import { PromotedTagNoImage } from '@app/enums'
import { IPromotedTag } from '@gtms/commons/models'
// state
import {
  loadGroupPromotedTags,
  reloadGroupPromotedTagsSilently,
  deletePromotedTag,
  addTagToFavs,
  deleteFavTag,
  loadGroupFavTags,
} from '@gtms/state-tag'
import {
  IPromotedTagsState,
  promotedTagsState,
  promotedTagsState$,
} from './state.query'
import { openLoginModal } from '@app/state'
// components
import { PromotedTagsForm } from '@app/components/group-settings/PromotedTagForm'
// ui
import { EmptyPromotedTags } from '@gtms/ui/EmptyPromotedTags'
import { Modal } from '@gtms/ui/Modal'
import { PromotedTagsList as PromotedTagsUIList } from '@gtms/ui/PromotedTagsList'
import { PromotedTags as PromotedTagsUIGrid } from '@gtms/ui/PromotedTags'
import { Spinner } from '@gtms/ui/Spinner'

export const PromotedTags: FC<{
  additionalStyles?: string
  onTagClick?: (tag: IPromotedTag) => unknown
  type?: string
}> = ({ additionalStyles, onTagClick, type }) => {
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
      if (!state.isLogged) {
        return openLoginModal()
      }

      if (!state.id) {
        return
      }

      checked ? addTagToFavs(tag, state.id) : deleteFavTag(tag, state.id)
    },
    [state.id, state.isLogged]
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

    if (state.id && state.isLogged) {
      loadGroupFavTags(state.id)
    }

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  return (
    <div className={additionalStyles}>
      {state.isLoading && <Spinner />}
      {state.isAdmin && !state.isLoading && state.tags.length === 0 && (
        <EmptyPromotedTags onAddClick={onAddTagClick} />
      )}
      {!state.isLoading &&
        state.tags.length > 0 &&
        (type === 'list' ? (
          <PromotedTagsUIList
            activeTags={state.activeTags}
            favs={state.favTags}
            isAdmin={state.isAdmin}
            isLoading={state.isLoading}
            noImage={PromotedTagNoImage}
            onDeleteRecordClick={onDeleteTagClick}
            onEditRecordClick={onEditTagClick}
            onFavClick={onFavClick}
            onNoRecordsClick={onAddTagClick}
            onTagClick={onTagClick}
            tags={state.tags}
          />
        ) : (
          <PromotedTagsUIGrid
            activeTags={state.activeTags}
            favs={state.favTags}
            isAdmin={state.isAdmin}
            isLoading={state.isLoading}
            noImage={PromotedTagNoImage}
            onDeleteRecordClick={onDeleteTagClick}
            onEditRecordClick={onEditTagClick}
            onFavClick={onFavClick}
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
