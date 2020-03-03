import React, { useEffect, useState } from 'react'
import { NextPage, NextPageContext } from 'next'
import { activateAccount } from '@gtms/api-auth'
import { useRouter } from 'next/router'
import { useTranslation } from '@gtms/commons/i18n'
import { Spinner } from '@gtms/ui/Spinner'
import { initAuthSession } from '@gtms/commons/helpers/auth'
import { redirect } from '@gtms/commons/helpers/redirect'
import { userQuery } from '@gtms/state-user'
import styles from './styles.scss'

export const ActivateAccountPage: NextPage<{}> = () => {
  const { t } = useTranslation('accountActivation')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const router = useRouter()
  const code: string = router.query.code as string

  useEffect(() => {
    activateAccount(code)
      .then(() => setIsLoading(false))
      .catch(() => {
        setHasError(true)
        setIsLoading(false)
      })
  }, [code])

  return (
    <div className={styles.wrapper} data-testid="activate-account-page">
      {isLoading && <Spinner />}
      {!isLoading && !hasError && (
        <h2 data-testid="activate-account-page-confirmation">
          {t('accountActivated')}
        </h2>
      )}
      {!isLoading && hasError && (
        <h2 data-testid="activate-account-page-activation-failed">
          {t('activationFailed')}
        </h2>
      )}
    </div>
  )
}

ActivateAccountPage.getInitialProps = async (ctx: NextPageContext) => {
  await initAuthSession(ctx)

  if (userQuery.isLogged()) {
    redirect('/', ctx)
  }

  return Promise.resolve({ namespacesRequired: ['accountActivation'] })
}

export default ActivateAccountPage
