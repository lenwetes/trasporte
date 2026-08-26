"use client";
import * as React from "react";

export const FormContainer = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);
