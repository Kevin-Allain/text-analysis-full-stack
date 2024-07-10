export const calculateOpacity = (score, min, max, binning, numBin, minOpacity = 0.05, maxOpacity = 0.85) => {
  if (min === max) return 0.90; // Handle the case where all scores are the same
  if (binning) {
    const binSize = (max - min) / numBin;
    const binIndex = Math.floor((score - min) / binSize);
    return minOpacity + (binIndex / (numBin - 1)) * (maxOpacity - minOpacity);
  } else {
    return minOpacity + ((score - min) / (max - min)) * maxOpacity;
  }
};

export const getBinFromScore = (score, min, max, numBin) => {
  const binSize = (max - min) / numBin;
  return Math.floor((score - min) / binSize);
};
