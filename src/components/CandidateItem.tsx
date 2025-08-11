import Image from "next/image";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Typography } from "./ui/typography";

interface Props {
  data: ICandidate;
}
const CandidateItemComponent: React.FC<Props> = ({ data }) => {
  return (
    <Card className="hover:border-primary relative h-72 w-full max-w-[250px] cursor-pointer border-2 p-0 transition-all">
      <CardContent className="flex h-full flex-col items-center gap-4 p-6">
        <Image
          src={data.image}
          alt={data.name}
          width={100}
          height={100}
          sizes="(max-width: 768px) 100px, 100px"
          className="aspect-square rounded-full object-cover"
        />
        <div className="mt-auto flex flex-col items-center justify-center gap-4">
          <Typography type="h3">{data.name}</Typography>
          <Typography className="line-clamp-2 min-h-14">
            {data.description}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
const CandidateItem = React.memo(CandidateItemComponent);
export default CandidateItem;
