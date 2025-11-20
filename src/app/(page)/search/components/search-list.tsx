import React from 'react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import PdfPreviewSheet from './pdf-preview-sheet';
import { P } from '@/components/ui/typography';

type PropsType = {
  datas: CvData[];
  error?: boolean;
  className?: string;
};

const SearchList = ({ datas, error, className }: PropsType) => {
  return (
    <div className={cn('flex flex-row flex-wrap gap-5', className)}>
      {error ? (
        <P>I couldn’t find any results matching your search.</P>
      ) : (
        datas?.map(data => {
          return (
            <>
              <Item variant="outline" className="w-xs">
                <ItemContent>
                  <div className="mb-5">
                    <ItemTitle>{data.fullName}</ItemTitle>
                    <ItemDescription>{data.position}</ItemDescription>
                  </div>
                  <ItemActions>
                    {/* <Button variant="secondary" size="sm">
                    Preview Cv
                  </Button> */}
                    <PdfPreviewSheet cvData={data} />
                  </ItemActions>
                </ItemContent>
              </Item>
            </>
          );
        })
      )}
    </div>
  );
};

export default SearchList;
