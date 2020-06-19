import React, { FC, useState, useEffect } from 'react'
import { IGroup } from '@gtms/commons/models'
import {
  groupInvitationsQuery,
  getGroupInvitations,
  IGroupInvitations,
  deleteGroupInvitation,
} from '@gtms/state-group'
import { Spinner } from '@gtms/ui/Spinner'
import { UserAvatar } from '@gtms/ui/UserAvatar'
import { Button } from '@gtms/ui/Button'
import { formatDistance } from 'date-fns'
import { pl } from 'date-fns/locale'
import { getImage, getDisplayName } from '@gtms/commons/helpers'
import { UserAvatarNoImage } from 'enums'

const RECORDS_PER_PAGE = 25

export const InvitationsSettings: FC<{ group: IGroup }> = ({ group }) => {
  const [state, setState] = useState<IGroupInvitations>(
    groupInvitationsQuery.getGroupInvitations()
  )

  useEffect(() => {
    getGroupInvitations(group.slug, 0, RECORDS_PER_PAGE)
    const sub = groupInvitationsQuery.getGroupInvitations$.subscribe((values) =>
      setState(values)
    )

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])
  return (
    <div data-testid="group-invitation-settings">
      {state.isLoading && (
        <div>
          <Spinner />
        </div>
      )}
      {!state.isLoading && state.errorOccured && (
        <div>Can not fetch invitations, try later</div>
      )}
      {!state.isLoading && state.records.length === 0 && (
        <div>no invitations, no one likes you, you stupid fuck</div>
      )}
      {!state.isLoading && state.records.length > 0 && (
        <ul>
          {state.records.map((invitation) => (
            <div key={`invitation-${invitation.id}`}>
              <div>
                <h3>
                  Sent at:{' '}
                  {formatDistance(new Date(invitation.createdAt), new Date(), {
                    locale: pl,
                  })}
                </h3>
              </div>
              {invitation.from && (
                <div>
                  <h3>From:</h3>
                  <UserAvatar
                    image={getImage(
                      '50x50',
                      invitation.from.avatar,
                      UserAvatarNoImage
                    )}
                  />
                  <h4>{getDisplayName(invitation.from)}</h4>
                </div>
              )}
              <div>
                <h3>To:</h3>
                <UserAvatar
                  image={getImage(
                    '50x50',
                    invitation.user.avatar,
                    UserAvatarNoImage
                  )}
                />
                <h4>{getDisplayName(invitation.user)}</h4>
              </div>
              <div>
                <p>{invitation.description || 'No message'}</p>
              </div>
              <Button onClick={() => deleteGroupInvitation(invitation.id)}>
                {/* add here a confirmation popup */}
                remove invitation
              </Button>
            </div>
          ))}
        </ul>
      )}
    </div>
  )
}