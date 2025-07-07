import React, { useEffect, useRef, useState } from "react";
import {
  BORDER_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDING,
} from "@/utils/constants";
import { wrapText } from "@/utils/wrapText";

interface NFTPreviewCanvasProps {
  title: string;
  message: string;
}

export const NFTPreviewCanvas: React.FC<NFTPreviewCanvasProps> = ({
  title,
  message,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);

  // Load the image only once
  useEffect(() => {
    const img = new window.Image();
    img.src = "/benja.jpg";
    img.onload = () => setBgImg(img);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImg) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image with opacity
    ctx.globalAlpha = 0.25;
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    // Overlay a semi-transparent white layer
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border with specified color
    ctx.strokeStyle = "oklch(0.3169 0.1379 288.0969)";
    ctx.lineWidth = BORDER_WIDTH;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw the custom title
    ctx.font = "bold 36px Comic Sans MS, Comic Sans, cursive";
    ctx.fillStyle = "#5A2360";
    ctx.textBaseline = "top";
    ctx.fillText(title || "CHOG Messenger", PADDING, PADDING);

    // Draw the message with wrapping
    ctx.font = "24px Comic Sans MS, Comic Sans, cursive";
    ctx.fillStyle = "#222";
    const maxTextWidth = CANVAS_WIDTH - 2 * PADDING;
    const lineHeight = 36;
    let y = PADDING + 48; // leave space for title
    message.split("\n").forEach((paragraph) => {
      y = wrapText(ctx, paragraph, PADDING, y, maxTextWidth, lineHeight) + 4;
    });
  }, [title, message, bgImg]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        borderRadius: 24,
        background: "#FFF5E9",
        boxShadow: "0 4px 24px #0002",
        display: "block",
      }}
    />
  );
};
