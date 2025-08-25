"use client";

import React, { ReactNode } from "react";

type AvatarProps = {
  children?: ReactNode;
  size?: number;
  className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({ children, size = 40, className = "" }) => {
  const style = { width: size, height: size };
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-white/10 text-white font-medium overflow-hidden ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

type AvatarImageProps = {
  src?: string;
  alt?: string;
  className?: string;
};

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, className = "" }) => {
  if (!src) return null;
  return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />;
};

type AvatarFallbackProps = {
  children?: ReactNode;
  className?: string;
};

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className = "" }) => {
  return <span className={`flex items-center justify-center w-full h-full ${className}`}>{children}</span>;
};
