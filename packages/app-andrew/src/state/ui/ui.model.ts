export interface IGroupUI {
  showPromoted: boolean
  showUsers: boolean
}

export interface IUI {
  isLoginModalOpen: boolean
  isNotificationsBarOpen: boolean
  isGroupsBarOpen: boolean
  background: string
  backgroundImage?: {
    full: string
    mini: string
  }
  groups: {
    [groupId: string]: IGroupUI
  }
}
