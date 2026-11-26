import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";

/** Nền kem có chấm halftone mịn như giấy, giống video gốc. */
export const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.bg,
      backgroundImage: `radial-gradient(${C.dot} 1.3px, transparent 1.4px)`,
      backgroundSize: "9px 9px",
    }}
  />
);
