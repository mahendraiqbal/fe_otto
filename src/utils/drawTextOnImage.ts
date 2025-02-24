export const drawTextOnImage = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  dear: string,
  message: string,
  from: string
) => {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Dear ${dear},`, canvas.width / 2, 50);
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`From ${from}`, canvas.width / 2, canvas.height - 50);
  }
};
