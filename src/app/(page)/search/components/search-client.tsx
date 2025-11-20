'use client';

import React from 'react';
import { useSearchCv } from '../useSearch';
import SearchForm from './search-form';
import SearchList from './search-list';
import { useSearchParams } from 'next/navigation';

const SearchClient = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const { cvs, error } = useSearchCv(name ?? '');

  return (
    <>
      <SearchForm searchName={name ?? ''} />
      <SearchList datas={cvs} error={error} className="mt-5" />
    </>
  );
};

export default SearchClient;
