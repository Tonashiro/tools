"use client";
import React, { useState } from "react";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { uploadToPinata } from "@/utils/uploadToPinata";
import { NFTPreviewCanvas } from "@/components/nft/nft-preview-canvas";
import {
  BORDER_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDING,
} from "@/utils/constants";
import { wrapText } from "@/utils/wrapText";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Wallet } from "@/components/auth/wallet";

const CONTRACT_ADDRESS = "0xed4e3f34642b86289CB2AC9558ef9b9271DbAB2b";
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "string", name: "message", type: "string" },
      { internalType: "string", name: "metadataURI", type: "string" },
    ],
    name: "mintMessage",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export default function NFTMessengerPage() {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  const { writeContract, isPending } = useWriteContract();

  const drawNFTImage = async (
    title: string,
    message: string
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    const bgImg = new window.Image();
    bgImg.src = "/benja.jpg";
    await new Promise((resolve, reject) => {
      bgImg.onload = resolve;
      bgImg.onerror = reject;
    });

    ctx.globalAlpha = 0.25;
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255,245,233,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "oklch(0.3169 0.1379 288.0969)";
    ctx.lineWidth = BORDER_WIDTH;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 36px Comic Sans MS, Comic Sans, cursive";
    ctx.fillStyle = "#5A2360";
    ctx.textBaseline = "top";
    ctx.fillText(title || "CHOG Messenger", PADDING, PADDING);

    ctx.font = "24px Comic Sans MS, Comic Sans, cursive";
    ctx.fillStyle = "#222";
    const maxTextWidth = CANVAS_WIDTH - 2 * PADDING;
    const lineHeight = 36;
    let y = PADDING + 48; // leave space for title
    message.split("\n").forEach((paragraph) => {
      y = wrapText(ctx, paragraph, PADDING, y, maxTextWidth, lineHeight) + 4;
    });

    return await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
  };

  const handleMint = async () => {
    setIsMinting(true);
    try {
      const blob = await drawNFTImage(title, message);

      const imageUrl = await uploadToPinata(blob, "nft-message.png");

      const metadata = {
        name: title || "CHOG Messenger",
        description: message,
        image: imageUrl,
      };
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });

      const metadataUrl = await uploadToPinata(metadataBlob, "metadata.json");

      await new Promise<void>((resolve, reject) => {
        writeContract(
          {
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "mintMessage",
            args: [recipient, message, metadataUrl],
            value: parseEther("0.1"),
            chainId: 10143,
          },
          {
            onSuccess: (result) => {
              console.log("Transaction successful:", result);
              resolve();
            },
            onError: (error) => {
              reject(error);
            },
            onSettled: (result) => {
              if (result && typeof result === "string") {
                toast.success(
                  <div>
                    <div className="font-semibold">Transaction confirmed!</div>
                    <div className="text-xs mt-1">
                      <span>Tx Hash: </span>
                      <a
                        href={`https://testnet.monadexplorer.com/tx/${result}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80"
                      >
                        {result.slice(0, 8)}...{result.slice(-6)}
                      </a>
                    </div>
                  </div>
                );
              }
            },
          }
        );
      });
    } catch (err: unknown) {
      let msg = "Unknown error";
      if (
        typeof err === "object" &&
        err &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        msg = (err as { message: string }).message;
      }
      toast.error(
        msg.includes("User rejected")
          ? "Transaction rejected by user."
          : "Something went wrong. Please try again."
      );
      console.error(err);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#32004F] flex flex-col items-center justify-center p-4 sm:p-4 w-full">
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          CHOG Messenger
        </h1>
        <p className="text-base sm:text-lg text-white/80">
          Message anyone in Monad, just add the user wallet address, your title
          and message. Each mint costs{" "}
          <span className="font-semibold text-secondary">0.1 MON</span> and will
          be permanently recorded on-chain with a custom NFT image.
        </p>
      </div>
      <div className="bg-white/15 rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-12 items-start max-w-4xl w-full">
        {/* Left: NFT Preview */}
        <div className="w-full flex justify-center md:justify-start mb-6 md:mb-0 md:w-auto">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-[480px] [&_canvas]:w-full [&_canvas]:h-full">
            <NFTPreviewCanvas title={title} message={message} />
          </div>
        </div>
        {/* Right: Form */}
        <div className="w-full max-w-md min-w-[220px] flex-shrink">
          <div className="flex gap-4 mb-6">
            <Wallet />
          </div>
          <Input
            type="text"
            placeholder="Enter Message title"
            value={title}
            maxLength={20}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 mb-4 text-base"
          />
          <Input
            type="text"
            placeholder="Message recipient wallet"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 mb-4 text-base"
          />
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            maxLength={300}
            className="w-full p-3 rounded-lg border border-gray-300 text-base mb-4 resize-none"
          />
          <Button
            type="button"
            onClick={handleMint}
            className="w-full py-6 flex items-center justify-center"
            size="lg"
            variant="secondary"
            disabled={
              isPending || isMinting || !recipient || !message || !title
            }
          >
            {isPending || isMinting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 border-2 border-white border-t-primary rounded-full animate-spin" />
              </span>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
