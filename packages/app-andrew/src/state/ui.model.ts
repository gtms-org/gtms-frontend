export interface IUI {
  isLoginModalOpen: boolean
  isNotificationsBarOpen: boolean
  background: string
  backgroundImage?: string
  groupsSidebar: {
    [groupsId: string]: boolean
  }
}
