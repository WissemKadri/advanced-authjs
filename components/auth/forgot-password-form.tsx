'use client';

import { forgotPassword } from '@/actions/forgot-password';
import { ForgotPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import CardWrapper from './card-wrapper';

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();

  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    startTransition(() => {
      forgotPassword(values)
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
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <fieldset className="space-y-6" disabled={isPending}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="john.doe@example.com" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={errorMessage} />
            <FormSuccess message={successMessage} />

            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </fieldset>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgotPasswordForm;
