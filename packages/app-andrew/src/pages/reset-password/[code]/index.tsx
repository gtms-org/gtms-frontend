import React, { useEffect, useState } from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { ResetPasswordForm } from '@app/components/reset-password/Form'
import { useTranslation, Link } from '@gtms/commons/i18n'
import { checkCodeReq } from '@gtms/api-auth'
import { redirect } from '@gtms/commons/helpers/redirect'
import { hasAuthSessionCookies } from '@gtms/state-user'
import { IoMdCheckmark } from 'react-icons/io'
// ui
import { Button } from '@gtms/ui/Button'
import { Spinner } from '@gtms/ui/Spinner'
// styles
import styles from './styles.scss'

export const ResetPasswordPage: NextPage<{}> = () => {
  const { t } = useTranslation('resetPassword')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const code: string = router.query.code as string
  const [isPasswordChanged, setIsPasswordChanged] = useState<boolean>(false)

  useEffect(() => {
    checkCodeReq({ code })
      .then(() => {
        setIsLoading(false)
      })
      .catch(() => {
        router.push({
          pathname: '/login',
        })
      })
  }, [code])

  return (
    <>
      <div className={styles.pageWrapper} data-testid="remind-password-page">
        <div className={styles.wrapper}>
          <div className={styles.centerIt}>
            {isLoading && <Spinner additionalStyles={styles.spinner} />}
            {!isLoading && !isPasswordChanged && (
              <>
                <h3 className={styles.header}>
                  {/* @todo GEOT-109 - put proper translations everywhere */}
                  {t('Podaj nowe haslo do swojego konta')}
                </h3>
                <ResetPasswordForm
                  code={code}
                  onSuccess={() => setIsPasswordChanged(true)}
                />
              </>
            )}
            {!isLoading && isPasswordChanged && (
              <>
                <h3
                  className={styles.header}
                  data-testid="reset-password-changed-confirmation"
                >
                  <i>
                    <IoMdCheckmark />
                  </i>
                  {t('passwordHasBeenChanged')}
                </h3>
                <Link href="/login">
                  <Button additionalStyles={styles.btn}>
                    {t('goToLogin')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.pageBg} />
    </>
  )
}

ResetPasswordPage.getInitialProps = async (ctx: NextPageContext) => {
  if (hasAuthSessionCookies(ctx)) {
    redirect('/', ctx)
  }

  return Promise.resolve({ namespacesRequired: ['resetPassword'] })
}

export default ResetPasswordPage
