import { uiStore } from './ui.store'
import { uiQuery } from './ui.query'
import { BACKGROUNDS_GALLERY } from '@app/enums'

export const openLoginModal = () =>
  uiStore.update({
    isLoginModalOpen: true,
  })

export const closeLoginModal = () =>
  uiStore.update({
    isLoginModalOpen: false,
  })

export const toggleLoginModal = () =>
  uiStore.update((values) => ({
    isLoginModalOpen: !values.isLoginModalOpen,
  }))

export const openSidebarNotifications = () =>
  uiStore.update({
    isNotificationsBarOpen: true,
  })

export const closeSidebarNotifications = () =>
  uiStore.update({
    isNotificationsBarOpen: false,
  })

export const toggleSidebarNotifications = () =>
  uiStore.update((values) => ({
    isNotificationsBarOpen: !values.isNotificationsBarOpen,
  }))

export const openGroupsBar = () =>
  uiStore.update(() => ({
    isGroupsBarOpen: true,
  }))

export const closeGroupsBar = () =>
  uiStore.update(() => ({
    isGroupsBarOpen: false,
  }))

export const toggleGroupsBar = () =>
  uiStore.update((values) => ({
    isGroupsBarOpen: !values.isGroupsBarOpen,
  }))

export const changePageBackground = (background: string) =>
  uiStore.update({
    background,
    backgroundImage: undefined,
  })

export const changePageBackgroundImage = (
  fullImage: string,
  miniImage: string
) => {
  uiStore.update({
    backgroundImage: {
      full: fullImage,
      mini: miniImage,
    },
  })
}

export const clearPageBackground = () =>
  uiStore.update({
    background: BACKGROUNDS_GALLERY[0].className,
    backgroundImage: undefined,
  })

export const showPromotedTagsInGroup = (groupId: string) => {
  const groupState = uiQuery.groupState(groupId)
  const groups = uiQuery.getValue().groups

  groupState.showPromoted = true
  groupState.showUsers = false

  uiStore.update({
    groups: {
      ...groups,
      [groupId]: groupState,
    },
  })
}

export const hidePromotedTagsInGroup = (groupId: string) => {
  const groupState = uiQuery.groupState(groupId)
  const groups = uiQuery.getValue().groups

  groupState.showPromoted = false

  uiStore.update({
    groups: {
      ...groups,
      [groupId]: groupState,
    },
  })
}

export const togglePromotedTagsInGroup = (groupId: string) => {
  const groupState = uiQuery.groupState(groupId)
  const groups = uiQuery.getValue().groups

  groupState.showPromoted = !groupState.showPromoted

  if (groupState.showPromoted) {
    groupState.showUsers = false
  }

  uiStore.update({
    groups: {
      ...groups,
      [groupId]: groupState,
    },
  })
}

export const showGroupUsers = (groupId: string) => {
  const groupState = uiQuery.groupState(groupId)
  const groups = uiQuery.getValue().groups

  groupState.showPromoted = false
  groupState.showUsers = true

  uiStore.update({
    groups: {
      ...groups,
      [groupId]: groupState,
    },
  })
}

export const hideGroupUsers = (groupId: string) => {
  const groupState = uiQuery.groupState(groupId)
  const groups = uiQuery.getValue().groups

  groupState.showUsers = false

  uiStore.update({
    groups: {
      ...groups,
      [groupId]: groupState,
    },
  })
}

export const toggleGroupUsers = (groupId: string) => {
  const groupState = uiQuery.groupState(groupId)
  const groups = uiQuery.getValue().groups

  groupState.showUsers = !groupState.showUsers

  if (groupState.showUsers) {
    groupState.showPromoted = false
  }

  uiStore.update({
    groups: {
      ...groups,
      [groupId]: groupState,
    },
  })
}
