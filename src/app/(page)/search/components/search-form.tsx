'use client';

import { Button } from '@/components/ui/button';
import { FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import React, { useEffect } from 'react';
import { useSearchCv } from '../useSearch';

const SearchForm = () => {
  const { cvs } = useSearchCv();

  useEffect(() => {
    console.log(cvs);
  }, [cvs]);

  return (
    <FieldSet className="flex">
      <Input type="text" name="name" value="" />
      <Button>Search</Button>
    </FieldSet>
  );
};

export default SearchForm;
