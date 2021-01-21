const audioCtx = new window.AudioContext();

export async function getDuration(data: Blob): Promise<number> {
  return new Promise(resolve => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(data);
    audio.load();

    audio.onloadedmetadata = () => {
      const duration = audio.duration;

      audio.remove();
      resolve(duration);
    };
  });
}

export function visualize(stream: MediaStream, container: HTMLDivElement) {
  const analyser = audioCtx.createAnalyser();
  const canvas = container.querySelector<HTMLCanvasElement>("#canvas");

  if (!container || !canvas) return;
  const WIDTH = container?.clientWidth || window.innerWidth;
  const HEIGHT = container?.clientHeight || 300;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Canvas context does not exist.");

  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);

  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  /*  container.appendChild(canvas); */

  function draw() {
    if (!canvas) throw Error("No canvas");
    if (!ctx) throw Error("Canvas context does not exist.");
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);
    ctx.fillStyle = "#1B1B1B";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();

    const sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * HEIGHT) / 2;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  draw();
}

export async function createStaticWaveForm(
  data: Blob,
  width = 200,
  height = 100
): Promise<string> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const arrayBuffer = await data.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  canvas.width = width;
  canvas.height = height;

  function drawBuffer(
    width: number,
    height: number,
    context: CanvasRenderingContext2D,
    buffer: AudioBuffer
  ) {
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;
    for (let i = 0; i < width; i++) {
      let min = 1.0,
        max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  }

  if (context) drawBuffer(canvas.width, canvas.height, context, audioBuffer);

  return canvas.toDataURL();
}

export const second = 20;
