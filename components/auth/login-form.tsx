'use client';

import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CardWrapper from './card-wrapper';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { useState, useTransition } from 'react';
import { login } from '@/actions/login';
import { z } from 'zod';

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();

  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values).then(data => {
        setErrorMessage(data.error);
        setSuccessMessage(data.success);
      });
    });
  };

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
              Sign in
            </Button>
          </fieldset>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
