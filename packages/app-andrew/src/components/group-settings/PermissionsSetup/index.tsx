import React, { FC, useState } from 'react'
import { IGroup } from '@gtms/commons/models'
import { GroupType, GroupVisibility } from '@gtms/commons/enums'
import { updateGroup } from '@gtms/state-group'
// ui
import { BsArrow90DegUp } from 'react-icons/bs'
import { SwitchWrapper } from '@gtms/ui/SwitchWrapper'
import { Button } from '@gtms/ui/Button'
import { Spinner } from '@gtms/ui/Spinner'
// styles
import styles from './styles.scss'

export const PermissionsSetup: FC<{ group: IGroup }> = ({ group }) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [settings, setSettings] = useState<{
    type: GroupType
    visibility: GroupVisibility
  }>({
    type: group.type,
    visibility: group.visibility,
  })

  const onSubmit = async () => {
    setIsSaving(true)

    try {
      await updateGroup(settings, group.slug)
    } finally {
      setIsSaving(false)
    }
  }
  return (
    <div data-testid="permissions-setup">
      <form method="post">
        <div className={styles.checkboxes}>
          <div className={styles.item}>
            <div>
              <SwitchWrapper
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    type: value ? GroupType.public : GroupType.private,
                  })
                }
                checked={settings.type === GroupType.public}
              />
              <label>Anyone can join</label>
            </div>
            <span>
              <i>
                <BsArrow90DegUp />
              </i>
              Any user can join the group. Joining does not require groups admin
              acceptation
            </span>
          </div>
          <div className={styles.item}>
            <div>
              <SwitchWrapper
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    visibility: value
                      ? GroupVisibility.public
                      : GroupVisibility.private,
                  })
                }
                checked={settings.visibility === GroupVisibility.public}
              />
              <label>
                {settings.visibility === GroupVisibility.public
                  ? 'Group is public'
                  : 'Group is private'}
              </label>
            </div>
            <span>
              <i>
                <BsArrow90DegUp />
              </i>
              If group is public, anyone can find it, and read its content. If
              not - only members can do that
            </span>
          </div>
        </div>
        <Button
          additionalStyles={styles.btn}
          disabled={isSaving}
          onClick={onSubmit}
          type="submit"
        >
          {isSaving && <Spinner size="xsm" />}
          Save
        </Button>
      </form>
    </div>
  )
}
