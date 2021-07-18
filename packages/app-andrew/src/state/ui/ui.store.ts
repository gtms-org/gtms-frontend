import { Store, StoreConfig } from '@datorama/akita'
import { IUI } from './ui.model'
import { BACKGROUNDS_GALLERY } from '@app/enums'

@StoreConfig({ name: 'ui' })
export class UIStore extends Store<IUI> {
  constructor() {
    super({
      isLoginModalOpen: false,
      isNotificationsBarOpen: false,
      isGroupsBarOpen: false,
      background: BACKGROUNDS_GALLERY[0].className,
      groups: {},
    })
  }
}

export const uiStore = new UIStore()
