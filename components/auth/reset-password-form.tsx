'use client';

import { resetPassword } from '@/actions/reset-password';
import { NewPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import CardWrapper from './card-wrapper';

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isPending, startTransition] = useTransition();

  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      resetPassword(values, token)
        .then(data => {
          setErrorMessage(data?.error);
          setSuccessMessage(data?.success);
        })
        .catch(() => {
          setErrorMessage('Something went wrong!');
          setSuccessMessage('');
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <fieldset className="space-y-6" disabled={isPending}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={errorMessage} />
            <FormSuccess message={successMessage} />

            <Button type="submit" className="w-full">
              Reset password
            </Button>
          </fieldset>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;
