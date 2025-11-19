'use client';

import React, { useEffect } from 'react';
import { useSearchCv } from '../useSearch';
import SearchForm from './search-form';
import SearchList from './search-list';
import { useSearchParams } from 'next/navigation';

const SearchClient = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const { cvs } = useSearchCv(name ?? '');

  useEffect(() => {
    console.log(cvs);
  }, [cvs]);

  return (
    <>
      <SearchForm />
      <SearchList datas={cvs} className="mt-5" />
    </>
  );
};

export default SearchClient;
