'use client'

import { login } from '@/actions/login'
import { LoginSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import CardWrapper from './card-wrapper'
import Link from 'next/link'

const LoginForm = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const [isPending, startTransition] = useTransition()

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email is already in use with different provider!'
      : ''
  )
  const [successMessage, setSuccessMessage] = useState<string | undefined>('')
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values, callbackUrl)
        .then(data => {
          if (data?.error) setErrorMessage(data.error)

          if (data?.success) {
            form.reset()
            setSuccessMessage(data.success)
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true)
          } else {
            setShowTwoFactor(false)
            form.resetField('code')
          }
        })
        .catch(() => {
          setErrorMessage('Something went wrong!')
          setSuccessMessage('')
          setShowTwoFactor(false)
          form.resetField('code')
        })
    })
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <fieldset className="space-y-6" disabled={isPending}>
            <div className="space-y-4">
              {!showTwoFactor ? (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="john.doe@example.com"
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormLabel>Password</FormLabel>

                          <Button
                            size="sm"
                            variant="link"
                            asChild
                            className="font-normal px-0 absolute top-1/2 -translate-y-1/2 right-0"
                          >
                            <Link href="/auth/forgot-password">
                              Forgot password ?
                            </Link>
                          </Button>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two factor code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="XXXXXX" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormError message={errorMessage} />
            <FormSuccess message={successMessage} />

            <Button type="submit" className="w-full">
              {showTwoFactor ? 'Confirm' : 'Login'}
            </Button>
          </fieldset>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginForm
