'use client';

import React, { useActionState } from 'react';
import { login } from '@/app/lib/auth';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const Login = () => {
  const [state, action] = useActionState(login, undefined);
  return (
    <div>
      <form action={action}>
        <Input type="text" name="email" placeholder="Email" defaultValue={state?.email} />
        <Input type="password" name="password" placeholder="Password" />
        <div>{state?.errors?.email && <p>{state.errors.email}</p>}</div>
        <div>{state?.errors?.password && <p>{state.errors.password}</p>}</div>
        <button type="submit">Login</button>
      </form>
      <Link href="/register">Register</Link>
    </div>
  );
};

export default Login;
