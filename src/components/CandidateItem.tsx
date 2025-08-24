import Image from "next/image";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Typography } from "./ui/typography";

interface Props {
  data: ICandidate;
}
const CandidateItemComponent: React.FC<Props> = ({ data }) => {
  return (
    <Card className="hover:border-primary relative w-full max-w-[250px] cursor-pointer border-2 p-0 transition-all">
      <CardContent className="flex h-full flex-col items-center gap-8 p-6">
        <Image
          src={data.image}
          alt={data.name}
          width={120}
          height={120}
          sizes="(max-width: 768px) 120px, 120px"
          className="aspect-square rounded-full object-cover"
        />
        <Typography type="h3" className="text-center">
          {data.name}
        </Typography>
      </CardContent>
    </Card>
  );
};
const CandidateItem = React.memo(CandidateItemComponent);
export default CandidateItem;
