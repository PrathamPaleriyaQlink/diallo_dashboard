import { Divider } from "primereact/divider";
import React from "react";

const CampaingDetailCard = ({title, data, col1, col2, col3, col4, col1Val, col2Val, col3Val, col4Val}) => {
  return (
    <div className="my-7 w-full  h-fit bg-[#1e1e1e] rounded-xl py-7">
      <div className="text-2xl px-7">{title}</div>
      <Divider />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-7 py-4">
        <div className="space-y-2">
          <div>{col1}</div>
          <div className="text-3xl">{col1Val}</div>
        </div>
        <div className="space-y-2">
          <div>{col2}</div>
          <div className="text-3xl">{col2Val}</div>
        </div>
        <div className="space-y-2">
          <div>{col3}</div>
          <div className="text-3xl">{col3Val}</div>
        </div>
        <div className="space-y-2">
          <div>{col4}</div>
          <div className="text-3xl">{col4Val}</div>
        </div>
      </div>
    </div>
  );
};

export default CampaingDetailCard;
