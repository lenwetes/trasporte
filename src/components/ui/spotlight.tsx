"use client";
import * as React from "react";

export const Spotlight = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);
