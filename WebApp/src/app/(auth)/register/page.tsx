'use client';

import React, { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { register } from '@/app/lib/auth';

const Register = () => {
  const [state, action] = useActionState(register, undefined);
  return (
    <div>
      <form action={action}>
        <Input name="email" type="text" placeholder="Email" defaultValue={state?.email} />
        <div>{state?.errors?.email && <p>{state.errors.email}</p>}</div>
        <Input name="password" type="password" placeholder="Password" />
        {state?.errors?.password && (
          <div>
            <div className="h-4 w-4" />
            <div>Password must:</div>
            {Array.isArray(state.errors.password) &&
              state.errors.password.map((error, index) => <div key={index}>{error}</div>)}
          </div>
        )}
        <Input name="confirmPassword" type="password" placeholder="Confirm Password" />
        <div>{state?.errors?.confirmPassword && <p>{state.errors.confirmPassword}</p>}</div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
