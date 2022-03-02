import { getHeatmapPoint } from "@/api/earth";
import { lonlatToFlat } from "@/utils/coord";

interface heatmapOption {
  radius: number;
  gradient: any;
}

class Heatmap {
  config;
  canvas: HTMLCanvasElement;
  context: any;
  minnum = 0;
  maxnum = 0;
  heatPluginData: any[] = [];
  constructor(config: heatmapOption) {
    this.config = config;
    // this.createCanvas();
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;

    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
  }
  async getData() {
    const heatData: any = await getHeatmapPoint();
    const temp: any[] = [];
    heatData.data.features.forEach((item: any) => {
      const target = lonlatToFlat(item.geometry.x, item.geometry.y);
      const randomNum = Math.round(Math.random() * 20 + 40);

      temp.push([Math.round(target.x), Math.round(target.y), randomNum]);
      if (this.minnum > randomNum) this.minnum = randomNum;
      if (this.maxnum < randomNum) this.maxnum = randomNum;
    });
    this.heatPluginData = temp;
  }
  async setHeatmap() {
    if (this.heatPluginData.length === 0) {
      await this.getData();
    }
    // console.log(heatPluginData);
    this.pointOper(this.heatPluginData);
    this.mapColors();
  }
  pointOper(points: any[]) {
    points.forEach((point) => {
      this.context.beginPath();
      const alpha = (point[2] - this.minnum) / (this.maxnum - this.minnum);
      this.context.globalAlpha = alpha;
      this.context.arc(
        point[0],
        point[1],
        this.config.radius,
        0,
        Math.PI * 2,
        true
      );
      const gradient = this.context.createRadialGradient(
        point[0],
        point[1],
        0,
        point[0],
        point[1],
        this.config.radius
      );
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      this.context.fillStyle = gradient;
      this.context.closePath();
      this.context.fill();
    });
  }
  mapColors() {
    const palette = this.setColorPaint();
    const img = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const imageData = img.data;
    for (let i = 0; i < imageData.length; i++) {
      const alpha = imageData[i];
      const offset = alpha * 4;
      if (!offset) continue;
      imageData[i - 3] = palette[offset];
      imageData[i - 2] = palette[offset + 1];
      imageData[i - 1] = palette[offset + 2];
    }
    this.context.putImageData(
      img,
      0,
      0,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
  setColorPaint() {
    const paletteCanvas = document.createElement("canvas");
    const paletteCtx: any = paletteCanvas.getContext("2d");
    const gradientConfig = this.config.gradient;
    paletteCanvas.width = 256;
    paletteCanvas.height = 1;
    const gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
    for (const key in gradientConfig) {
      gradient.addColorStop(parseFloat(key), gradientConfig[key]);
    }
    paletteCtx.fillStyle = gradient;
    paletteCtx.fillRect(0, 0, 256, 1);
    return paletteCtx.getImageData(0, 0, 256, 1).data;
  }
  async refresh(radius: number) {
    this.config.radius = radius;
    this.clearCanvas();
    await this.setHeatmap();
  }
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export { Heatmap };
