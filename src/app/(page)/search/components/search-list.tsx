import React from 'react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import PdfPreviewSheet from './pdf-preview-sheet';
import { P } from '@/components/ui/typography';
import AcvtAvatar from '@/components/acvt-avatar';

type PropsType = {
  datas: CvData[];
  error?: boolean;
  className?: string;
};

const SearchList = ({ datas, error, className }: PropsType) => {
  return (
    <div className={cn('flex flex-wrap gap-5', className)}>
      {error ? (
        <P>I couldn’t find any results matching your search.</P>
      ) : (
        datas?.map(data => {
          return (
            <>
              <Item variant="outline" className="basis-[calc(33.333%-1.25rem)] p-4 items-start" key={data.cvId}>
                <ItemContent>
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="flex gap-4 items-start mb-2">
                      <AcvtAvatar
                        imgName={data.imgDataUrl}
                        imgVersion={data.imgVersion}
                        alt={data.fullName}
                        fullName={data.fullName}
                        className="h-15 w-15 rounded-lg"
                      />
                      <div>
                        <ItemTitle className="text-base">{data.fullName}</ItemTitle>
                        <ItemDescription className="text-xs">{data.position}</ItemDescription>
                      </div>
                    </div>
                  </div>
                  <ItemActions>
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
