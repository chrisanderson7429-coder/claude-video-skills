import React from "react";
import { Composition } from "remotion";
import { Video, TAIL, themeSchema, OY_WORDS } from "./Video";
import { msToF } from "./lib";
import { FPS, W, H } from "./theme";
import { MouthCalib, calibSchema, calibDefaults } from "./MouthCalib";
import { IMG_W, IMG_H } from "./data/poses";

const DURATION = msToF(OY_WORDS[OY_WORDS.length - 1].e) + TAIL;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CharacterExample"
      component={Video}
      durationInFrames={DURATION}
      fps={FPS}
      width={W}
      height={H}
      schema={themeSchema}
      defaultProps={{ mauChuDao: "#0B6E6E", mauNen: "#EAF0EE" }}
    />
    {/* Công cụ canh miệng/mắt cho ảnh pose mới (xem POSES.md) */}
    <Composition id="CanhMieng" component={MouthCalib} durationInFrames={30} fps={FPS} width={IMG_W} height={IMG_H} schema={calibSchema} defaultProps={calibDefaults} />
  </>
);
