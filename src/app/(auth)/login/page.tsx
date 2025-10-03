'use client';

import React, { useActionState } from 'react';
import { login } from '@/app/lib/auth';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Login = () => {
  const [state, action] = useActionState(login, undefined);
  return (
    <div className="flex items-center justify-center pt-50">
      <div className="w-100 border border-gray-400 rounded-md p-5 shadow-xl">
        <div className="flex justify-center mb-5">
          <Image
            className="object-cover w-50"
            alt="Avensia Logo"
            src="/assets/images/avensia-horizontal-dark.png"
            width={350}
            height={97}
          />
        </div>
        <form action={action}>
          <div className="mb-5">
            <Label className="mb-2" htmlFor="email">
              Email
            </Label>
            <Input id="email" type="text" name="email" placeholder="Email" defaultValue={state?.email} />
          </div>
          <div className="mb-5">
            <Label className="mb-2" htmlFor="password">
              Password
            </Label>
            <Input id="password" type="password" name="password" placeholder="Password" />
          </div>
          <div className="mb-5">
            {state?.errors?.email && <p className="text-red-600">{state.errors.email}</p>}
            {state?.errors?.password && <p className="text-red-600">{state.errors.password}</p>}
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">Login</Button>
            <Link href="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
