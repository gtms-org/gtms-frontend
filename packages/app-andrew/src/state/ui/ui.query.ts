import { Query } from '@datorama/akita'
import { Observable, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { userQuery, UserQuery } from '@gtms/state-user'
import { IUI, IGroupUI } from './ui.model'
import { UIStore, uiStore } from './ui.store'
import { BACKGROUNDS_GALLERY } from '@app/enums'

export class UIQuery extends Query<IUI> {
  public isLoginModalOpen = (values = this.getValue()) => {
    return values.isLoginModalOpen && !this.userQuery.isLogged()
  }

  public isLoginModalOpen$: Observable<boolean> = combineLatest([
    this.select(),
    this.userQuery.isLogged$,
  ]).pipe(
    map(([{ isLoginModalOpen }, isLogged]: any): boolean => {
      return !isLogged && isLoginModalOpen
    })
  )

  public pageBackground = (
    value = this.getValue()
  ): { name: string | null; className: string; full?: string } => {
    const bgName = value.background
    let bg = BACKGROUNDS_GALLERY.find((b) => b.name === bgName)

    if (!bg) {
      bg = BACKGROUNDS_GALLERY[0]
    }

    return bg
  }

  public pageBackground$: Observable<{
    name: string | null
    className: string
    full?: string
  }> = this.select((value) => {
    return this.pageBackground(value)
  })

  public pageBackgroundImage = (
    value = this.getValue()
  ): { mini: string; full: string } | undefined => {
    return value.backgroundImage
  }

  public pageBackgroundImage$: Observable<
    { mini: string; full: string } | undefined
  > = this.select((value) => {
    return this.pageBackgroundImage(value)
  })

  public pageBackgrounds = (value = this.getValue()) => ({
    background: this.pageBackground(value),
    backgroundImage: this.pageBackgroundImage(value),
  })

  public pageBackgrounds$: Observable<{
    background: {
      name: string | null
      className: string
      full?: string
    }
    backgroundImage: { mini: string; full: string } | undefined
  }> = this.select((value) => this.pageBackgrounds(value))

  public isNotificationsBarOpen = (values = this.getValue()) => {
    return values.isNotificationsBarOpen
  }

  public isNotificationsBarOpen$: Observable<boolean> = this.select((values) =>
    this.isNotificationsBarOpen(values)
  )

  public isGroupsBarOpen = (values = this.getValue()) => {
    return values.isGroupsBarOpen
  }

  public isGroupsBarOpen$: Observable<boolean> = this.select((values) =>
    this.isGroupsBarOpen(values)
  )

  public groupState = (groupId: string, value = this.getValue()): IGroupUI => {
    const { groups } = value

    return (
      groups[groupId] || {
        showPromoted: false,
        showUsers: false,
      }
    )
  }

  public groupState$ = (groupId: string): Observable<IGroupUI> =>
    this.select((values) => this.groupState(groupId, values))

  constructor(protected store: UIStore, private userQuery: UserQuery) {
    super(store)
  }
}

export const uiQuery = new UIQuery(uiStore, userQuery)
