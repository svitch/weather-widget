export const getDirection = (deg: number): string => {
  const directions: string[] = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW',
    'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
  const degree: number = Math.floor(deg / 22.5);
  return directions[degree];
};
