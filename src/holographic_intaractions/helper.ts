const radians = (degrees: number) => {
  return degrees * Math.PI / 180;
}

const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
  return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
}

const hexToRgbTreeJs = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}

export { radians, distance, map, hexToRgbTreeJs };