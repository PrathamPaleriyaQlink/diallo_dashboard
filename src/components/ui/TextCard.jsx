import React from "react";

function TextCard({title, value}) {
  return (
    <div className="w-full">
      <div className="text-sm my-2">{title}</div>
      <div className="w-full bg-[#212121] px-5 py-3 rounded-xl">
        {value}
      </div>
    </div>
  );
}

export default TextCard;
