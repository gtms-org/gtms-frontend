import React, { FC } from 'react'
import { useTranslation } from 'i18n'
import { setItem } from 'helpers/localStorage'

export const Logout: FC<{
  text?: string
}> = ({ text }) => {
  const { t } = useTranslation('common')

  return (
    <a
      data-testid="logout-button"
      onClick={() => setItem('logout', '' + Date.now())}
      href="/logout"
    >
      {text ?? t('logout')}
    </a>
  )
}
