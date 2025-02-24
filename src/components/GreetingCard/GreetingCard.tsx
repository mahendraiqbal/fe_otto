"use client";

import React, { useState, useRef, useEffect } from "react";
import useImageUpload from "../../hooks/useImageUpload";
import Swal from "sweetalert2";

const GreetingCard: React.FC = () => {
  const [dear, setDear] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { image, handleImageUpload } = useImageUpload();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const validateInputs = (): boolean => {
    if (!image) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please upload an image",
        showConfirmButton: false,
        timer: 3000,
      });
      return false;
    }
    if (!dear.trim()) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please enter recipient's name",
        showConfirmButton: false,
        timer: 3000,
      });
      return false;
    }
    if (!message.trim()) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please enter your message",
        showConfirmButton: false,
        timer: 3000,
      });
      return false;
    }
    if (!from.trim()) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please enter your name",
        showConfirmButton: false,
        timer: 3000,
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Set text styling
          ctx.font = "18px 'Times New Roman', serif";
          ctx.fillStyle = "#4A3728";
          ctx.textAlign = "center";

          // Dear section
          ctx.fillText(` ${dear}`, canvas.width / 2, 120);

          // Message section with 15 character limit per line
          const maxCharsPerLine = 15;
          let y = canvas.height / 2 - 30;
          const lineHeight = 30;

          // Split message into chunks of 15 characters
          let remainingMessage = message;
          while (remainingMessage.length > 0) {
            const line = remainingMessage.slice(0, maxCharsPerLine);
            ctx.fillText(line, canvas.width / 2, y);
            remainingMessage = remainingMessage.slice(maxCharsPerLine);
            y += lineHeight;
          }

          // From section
          ctx.fillText(` ${from}`, canvas.width / 2, canvas.height - 140);
        }
      };
    }
  }, [image, dear, message, from]);

  const handleImageValidation = (file: File | null) => {
    if (!file) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please select an image",
        showConfirmButton: false,
        timer: 3000,
      });
      return false;
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please upload a valid image file (JPEG, PNG, or GIF)",
        showConfirmButton: false,
        timer: 3000,
      });
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Image size should be less than 5MB",
        showConfirmButton: false,
        timer: 3000,
      });
      return false;
    }

    return true;
  };

  const handleDownload = async () => {
    try {
      if (!validateInputs()) return;

      setIsLoading(true);
      const canvas = canvasRef.current;
      if (canvas) {
        const link = document.createElement("a");
        link.download = "greeting-card.png";
        link.href = canvas.toDataURL();
        link.click();

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Card downloaded successfully!",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to download image",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Greeting Card Generator</h1>

        <div className="flex flex-col items-start mb-6">
          <label className="text-lg font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (handleImageValidation(file)) {
                handleImageUpload(e);
              }
            }}
            className="w-full p-2 border rounded"
            accept="image/*"
            data-testid="file-input"
          />
        </div>

        {image && (
          <div className="mt-6 relative">
            <img
              src={image}
              alt="Greeting Card Background"
              className="max-w-full h-auto rounded"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0"
              width={350}
              height={350}
            />
          </div>
        )}

        <div className="space-y-4 mt-6">
          <div className="flex flex-col items-start">
            <label className="text-lg font-semibold mb-2">Dear</label>
            <input
              type="text"
              value={dear}
              onChange={(e) => setDear(e.target.value)}
              placeholder="Enter name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-lg font-semibold mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-lg font-semibold mb-2">From</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isLoading}
          className={`mt-6 w-full p-2 ${
            isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded`}
        >
          {isLoading ? "Processing..." : "Download Image"}
        </button>
      </div>
    </div>
  );
};

export default GreetingCard;
