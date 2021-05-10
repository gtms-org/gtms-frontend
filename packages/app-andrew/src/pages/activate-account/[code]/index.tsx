import React, { useEffect, useState } from 'react'
import { NextPage, NextPageContext } from 'next'
import { activateAccount } from '@gtms/api-auth'
import { useRouter } from 'next/router'
import { useTranslation } from '@gtms/commons/i18n'
import { Spinner } from '@gtms/ui/Spinner'
import { redirect } from '@gtms/commons/helpers/redirect'
import { hasAuthSessionCookies } from '@gtms/state-user/src/helpers'
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
    <div className={styles.pageWrapper} data-testid="activate-account-page">
      <div className={styles.wrapper}>
        {isLoading && <Spinner />}
        {!isLoading && !hasError && (
          <h2
            className={styles.header}
            data-testid="activate-account-page-confirmation"
          >
            {t('accountActivated')}
          </h2>
        )}
        {!isLoading && hasError && (
          <h2 data-testid="activate-account-page-activation-failed">
            {t('activationFailed')}
          </h2>
        )}
      </div>
    </div>
  )
}

ActivateAccountPage.getInitialProps = async (ctx: NextPageContext) => {
  if (hasAuthSessionCookies(ctx)) {
    redirect('/', ctx)
  }

  return { namespacesRequired: ['accountActivation'] }
}

export default ActivateAccountPage
