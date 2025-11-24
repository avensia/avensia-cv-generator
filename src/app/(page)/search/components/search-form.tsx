'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

type PropsType = {
  searchName: string;
};

const SearchForm = ({ searchName }: PropsType) => {
  const [searchText, setSearchText] = useState<string>(searchName);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const segment = searchText ? `?name=${encodeURIComponent(searchText)}` : '';
    router.replace(`/search${segment}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet className="flex flex-row">
        <Input
          type="text"
          name="name"
          onChange={handleChange}
          value={searchText}
          autoComplete="off"
          placeholder="search using resouce name"
        />
        <Button type="submit">Search</Button>
      </FieldSet>
    </form>
  );
};

export default SearchForm;
