import {
  UserQuery,
  userQuery,
  MyGroupsQuery,
  myGroupsQuery,
} from '@gtms/state-user'
import {
  notificationsQuery,
  NotificationsQuery,
  INotificationRecord,
} from '@gtms/state-notification'
import { IGroup } from '@gtms/commons/models'
import { uiQuery, UIQuery } from '@app/state'
import { Observable, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { IImage } from '@gtms/commons/types/image'

export interface INavigationProps {
  isLogged: boolean
  userAvatar: IImage | null
}

export interface INotificationsSidebarProps {
  isOpen: boolean
  notifications: INotificationRecord[]
  unreadCount: number
  isLogged: boolean
  isLoaded: boolean
}

export interface INavigationDotsProps {
  isVisible: boolean
  isLogged: boolean
  isLoaded: boolean
  groups: IGroup[]
}

export class BaseUIQuery {
  constructor(
    private userQuery: UserQuery,
    private uiQuery: UIQuery,
    private myGroupsQuery: MyGroupsQuery,
    private notificationsQuery: NotificationsQuery
  ) {}

  public navigation = (): INavigationProps => {
    const isLogged = this.userQuery.isLogged()

    return {
      isLogged,
      userAvatar: isLogged ? this.userQuery.getAvatar('50x50') : null,
    }
  }

  public navigation$: Observable<INavigationProps> = this.userQuery.select(() =>
    this.navigation()
  )

  public notificationsSidebar = (): INotificationsSidebarProps => {
    return {
      isOpen:
        this.userQuery.isLogged() && this.uiQuery.isNotificationsBarOpen(),
      notifications: this.notificationsQuery.getAll(),
      unreadCount: this.notificationsQuery.unread().length,
      isLoaded: this.notificationsQuery.getValue().isLoaded,
      isLogged: this.userQuery.isLogged(),
    }
  }

  public notificationsSidebar$: Observable<
    INotificationsSidebarProps
  > = combineLatest([
    this.userQuery.isLogged$,
    this.uiQuery.isNotificationsBarOpen$,
    this.notificationsQuery.select(),
  ]).pipe(map(() => this.notificationsSidebar()))

  public navigationDots = (): INavigationDotsProps => {
    const status = this.myGroupsQuery.status()
    const isLogged = this.userQuery.isLogged()

    return {
      isVisible:
        isLogged &&
        !status.errorOccurred &&
        !status.isLoading &&
        status.isLoaded,
      isLoaded: status.isLoaded,
      isLogged,
      groups: this.myGroupsQuery.favGroups(),
    }
  }

  public navigationDots$: Observable<INavigationDotsProps> = combineLatest([
    this.userQuery.isLogged$,
    this.myGroupsQuery.status$,
    this.myGroupsQuery.favGroups$,
  ]).pipe(map(() => this.navigationDots()))

  public isOffCanvasOpen = (): boolean => {
    return this.notificationsSidebar().isOpen
  }

  public isOffCanvasOpen$: Observable<boolean> = combineLatest([
    this.notificationsQuery.select(),
    this.uiQuery.isNotificationsBarOpen$,
  ]).pipe(map(() => this.isOffCanvasOpen()))
}
//
export const baseUIQuery = new BaseUIQuery(
  userQuery,
  uiQuery,
  myGroupsQuery,
  notificationsQuery
)
