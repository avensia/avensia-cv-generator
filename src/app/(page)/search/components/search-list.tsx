import React from 'react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import PdfPreviewSheet from './pdf-preview-sheet';

type PropsType = {
  datas: CvData[];
  className?: string;
};

const SearchList = ({ datas, className }: PropsType) => {
  return (
    <div className={cn('flex flex-row flex-wrap gap-5', className)}>
      {datas?.map(data => {
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
      })}
    </div>
  );
};

export default SearchList;
