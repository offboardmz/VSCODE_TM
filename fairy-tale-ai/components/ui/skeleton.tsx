"use client";

import React, { ReactNode } from "react";
import clsx from "clsx";

type SkeletonProps = {
  children?: ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  children,
  className,
  width,
  height,
  circle = false,
}) => {
  const baseClasses = "bg-white/10 animate-pulse rounded-md";
  const circleClasses = circle ? "rounded-full" : "";
  const style: React.CSSProperties = {
    width,
    height,
  };

  return (
    <div className={clsx(baseClasses, circleClasses, className)} style={style}>
      {children}
    </div>
  );
};
