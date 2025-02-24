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
          ctx.font = "24px cursive";
          ctx.fillStyle = "#4A3728";
          ctx.textAlign = "center";

          // Dear section
          ctx.fillText(`Dear ${dear}`, canvas.width / 2, 120);

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
          ctx.fillText(`From ${from}`, canvas.width / 2, canvas.height - 100);
        }
      };
    }
  }, [image, dear, message, from]);