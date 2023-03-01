function getRandomRGBA(opacity: number) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function generateRandomRGBAArrays(n: number, opacity: number) {
  const colorArray1 = [];
  const colorArray2 = [];
  for (let i = 0; i < n; i++) {
    const color = getRandomRGBA(1);
    colorArray1.push(color);
    colorArray2.push(color.replace("1)", `${opacity})`));
  }
  return [colorArray1, colorArray2];
}
// // Usage example:
// const randomColors = generateRandomRGBAArray(10, 0.5);
// console.log(randomColors); // ["rgba(7, 102, 46, 0.5)", "rgba(24, 104, 171, 0.5)", "rgba(235, 109, 97, 0.5)", "rgba(195, 116, 78, 0.5)", "rgba(95, 73, 206, 0.5)", "rgba(50, 6, 192, 0.5)", "rgba(131, 237, 72, 0.5)", "rgba(25, 58, 25, 0.5)", "rgba(122, 153, 70, 0.5)", "rgba(21, 110, 212,
