import clsx from "clsx";
import Image from "next/image";
import type { ReactElement } from "react";

import type { TOURNAMENT } from "@lpr/types";

export const Tournament = ({
  name,
  logo,
  status,
  base64,
}: TOURNAMENT): ReactElement => {
  const isActive = status;

  return (
    <div
      className={clsx(
        "flex flex-col items-center p-2 text-center radius-md relative min-w-[200px] overflow-hidden text-dark bg-white rounded-lg shadow border-[1px] border-transparent transition-colors",
        !isActive && "cursor-not-allowed",
        isActive && "hover:border-primary"
      )}
    >
      {!isActive ? (
        <div className="absolute top-0 right-0 w-24 mt-4 -mr-5 text-sm font-bold bg-primary rotate-[45deg]">
          <span>Soon</span>
        </div>
      ) : null}
      <Image
        src={logo}
        alt={`${name} logo`}
        height={60}
        width={60}
        id={name}
        placeholder="blur"
        blurDataURL={base64}
      />
      <p className="capitalize">{name}</p>
    </div>
  );
};
