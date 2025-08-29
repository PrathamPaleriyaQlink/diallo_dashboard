import React from "react";

const StatsCard = ({title, value, icon}) => {
  return (
    <div className="bg-[#212121] w-full px-6 py-5 rounded-xl h-[120px] flex items-center">
      <div className="flex flex-col h-full flex-1 justify-center">
        <div>{title}</div>
        <div className="text-3xl font-bold mt-1">{value}</div>
      </div>

      <div
        className={`pi pi-${icon} w-fit bg-white text-black text-xl p-4 rounded-2xl`}
        style={{ fontSize: "20px" }}
      />
    </div>
  );
};

export default StatsCard;
