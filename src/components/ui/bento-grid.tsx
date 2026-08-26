"use client";
import * as React from "react";

export const BentoGrid = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    {...props} 
    style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
      gap: "20px",
      ...props.style 
    }}
  >
    {children}
  </div>
);

export const BentoGridItem = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    {...props} 
    style={{ 
      padding: "20px", 
      borderRadius: "0px", 
      border: "1px solid #e2e8f0", 
      backgroundColor: "#fff",
      ...props.style 
    }}
  >
    {children}
  </div>
);
