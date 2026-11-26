import React from "react";
import { Composition } from "remotion";
import { FPS, W, H } from "./theme";
import { Motion5Video, M5_DURATION } from "./videos/example/Video";

// Mỗi video mới: chép thư mục src/videos/example thành src/videos/<ten-video>, rồi thêm một <Composition> ở đây.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="GoldExample" component={Motion5Video} durationInFrames={M5_DURATION} fps={FPS} width={W} height={H} />
  </>
);
