import clsx from "clsx";
import { createElement, ReactElement, ReactNode } from "react";

export interface TitleProps {
  tag: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
}

export const Title = ({
  tag,
  children,
  className,
}: TitleProps): ReactElement => {
  const titleTag = createElement(
    tag,
    {
      className: clsx(
        "font-title dark:text-white font-bold text-5xl",
        className
      ),
    },
    children
  );

  return titleTag;
};
