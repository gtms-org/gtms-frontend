import React, { useState, useEffect } from 'react'
import { NextPage, NextPageContext } from 'next'
import {
  groupQuery,
  IGroupState,
  getGroup,
  markAsLoading,
} from '@gtms/state-group'
import { hasAuthSessionCookies } from '@gtms/state-user'
import {
  changePageBackground,
  clearPageBackground,
  changePageBackgroundImage,
} from '@app/state'
import { redirect, getImage } from '@gtms/commons/helpers'
import { IGroup } from '@gtms/commons/models'
import { useInitState } from '@gtms/commons/hooks'
// state
import {
  IGroupSettingsPageState,
  groupSettingsPageState,
  groupSettingsPageState$,
} from '@app/queries/groupSettingsPage.query'
// components
import { GroupHeader } from '@app/components/group/GroupHeader'
import { PromotedTags } from '@app/components/group/PromotedTags'
import { GroupDeleteGroup } from '@app/components/group/GroupDeleteGroup'
import {
  GroupSettingsSidebar,
  Tabs,
} from '@app/components/group/GroupSettingsSidebar'
import { AdminsSettings } from '@app/components/group-settings/Admins'
import { BasicInfoSetup } from '@app/components/group-settings/BasicInfoSetup'
import { GroupBackgroundSettings } from '@app/components/group-settings/GroupBackground'
import { GroupMembers } from '@app/components/group/GroupMembers'
import { PermissionsSetup } from '@app/components/group-settings/PermissionsSetup'
// sections
import { InvitationsSettings } from '@app/components/group-settings/Invitations'
import { MembersSettings } from '@app/components/group-settings/Members'
import { TagsSettings } from '@app/components/group-settings/Tags'
// ui
import { ErrorWrapper } from '@gtms/ui/ErrorWrapper'
import { Spinner } from '@gtms/ui/Spinner'
// styles
import styles from './styles.scss'

type GroupSettingsPageProps = {
  namespacesRequired: readonly string[]
  slug: string
}

const getInitialTab = () => {
  if (typeof window === 'undefined') {
    return Tabs.general
  }
  const urlTab = window.location.hash.substr(1)

  return Object.values(Tabs).includes(urlTab as any)
    ? Tabs[urlTab as Tabs]
    : Tabs.general
}

export const GroupSettingsPage: NextPage<GroupSettingsPageProps> = ({
  slug,
}) => {
  useInitState(markAsLoading)

  const [group, setGroup] = useState<IGroupState>(groupQuery.getValue())
  const [tab, setTab] = useState<Tabs>(Tabs.general)
  const [state, setState] = useState<IGroupSettingsPageState>(
    groupSettingsPageState()
  )

  useEffect(() => {
    setTab(getInitialTab())
    getGroup(slug as string)

    const groupSub = groupQuery.allState$.subscribe((value) => {
      if (!value.isLoading && !groupQuery.hasAdminRights()) {
        return redirect(`/group/${slug}`)
      }

      if (value.group?.bgType) {
        if (value.group?.bgType === 'file') {
          changePageBackgroundImage(
            getImage('origin', value.group.bg).jpg,
            getImage('mini', value.group.bg).jpg
          )
        } else {
          changePageBackground(value.group?.bgType)
        }
      }

      setGroup(value)
    })

    const sub = groupSettingsPageState$.subscribe((value) => {
      setState(value)
    })

    return () => {
      clearPageBackground()
      groupSub && !groupSub.closed && groupSub.unsubscribe()
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  if (group.notFound) {
    return (
      <ErrorWrapper>
        <h2>Group not found</h2>
      </ErrorWrapper>
    )
  }

  return (
    <div className={styles.pageWrapper} data-testid="group-settings-page">
      <GroupHeader additionalStyles={styles.groupHeader} />
      {state.showPromoted && (
        <PromotedTags
          additionalStyles={styles.promotedTags}
          onTagClick={() => null}
        />
      )}
      {state.showUsers && (
        <GroupMembers
          additionalStyles={styles.groupMembers}
          slug={state.groupSlug}
          {...state.members}
        />
      )}
      {!group.isLoading && group.errorOccured && (
        <ErrorWrapper>
          <h2>Can not fetch group details, try again later</h2>
        </ErrorWrapper>
      )}
      {group.isLoading && !group.errorOccured && (
        <Spinner additionalStyles={styles.spinner} />
      )}
      {!group.isLoading &&
        !group.errorOccured &&
        !(state.showPromoted || state.showUsers) && (
          <div className={styles.columns}>
            <GroupSettingsSidebar
              additionalStyles={styles.sidebar}
              setTab={setTab}
              tab={tab}
            />
            <div className={styles.content}>
              {tab === Tabs.general && (
                <>
                  {group.group && <BasicInfoSetup group={group.group} />}
                  {group.group && (
                    <GroupBackgroundSettings group={group.group} />
                  )}
                  {group.group && <PermissionsSetup group={group.group} />}
                  <div className={styles.btnDeleteWrapper}>
                    <GroupDeleteGroup
                      additionalStyles={styles.btnDelete}
                      onConfirm={() => null}
                    />
                  </div>
                </>
              )}

              {tab === Tabs.tags && (
                <TagsSettings
                  id={group.group?.id || ''}
                  tags={group.group?.tags || []}
                />
              )}

              {tab === Tabs.invitations && (
                <InvitationsSettings group={group.group as IGroup} />
              )}

              {tab === Tabs.admins && (
                <AdminsSettings group={group.group as IGroup} />
              )}

              {tab === Tabs.members && (
                <MembersSettings group={group.group as IGroup} />
              )}
            </div>
          </div>
        )}
    </div>
  )
}

GroupSettingsPage.getInitialProps = async (ctx: NextPageContext) => {
  const { slug } = ctx?.query

  if (!hasAuthSessionCookies(ctx)) {
    redirect(`/login`, ctx)
  }

  return Promise.resolve({
    namespacesRequired: ['groupSettingsPage'],
    slug: slug as string,
  })
}

export default GroupSettingsPage
