'use client'

import { BeatLoader } from 'react-spinners'
import CardWrapper from './card-wrapper'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { newVerification } from '@/actions/new-verification'
import FormSuccess from '../form-success'
import FormError from '../form-error'

const NewVerificationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>('')
  const [successMessage, setSuccessMessage] = useState<string | undefined>('')

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const onSubmit = useCallback(() => {
    if (!token) {
      setErrorMessage('Missing token!')
      return
    }

    newVerification(token)
      .then(data => {
        setErrorMessage(data?.error)
        setSuccessMessage(data?.success)
      })
      .catch(() => {
        setErrorMessage('Something went wrong!')
        setSuccessMessage('')
      })
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!errorMessage && !successMessage && <BeatLoader />}

        <FormError message={errorMessage} />
        <FormSuccess message={successMessage} />
      </div>
    </CardWrapper>
  )
}

export default NewVerificationForm
