export const calculateDistribution = (totalMeters: number, floorCount: number) => {
  if (floorCount === 0) return [];
  
  // Formula: S = (n/2) * [2a + (n-1)d] where d = 2
  // a = (S/n) - (n-1)
  const d = 2;
  const a = Math.floor((totalMeters / floorCount) - (floorCount - 1));
  
  const distribution: number[] = [];
  let runningSum = 0;

  for (let i = 0; i < floorCount; i++) {
    const value = i === floorCount - 1 
      ? totalMeters - runningSum // Last floor gets the remainder to ensure exact total
      : a + (i * d);
    
    distribution.push(Math.max(0, value));
    runningSum += Math.max(0, value);
  }

  return distribution;
};