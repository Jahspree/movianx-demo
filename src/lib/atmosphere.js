export function getAtmosphereState(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 22 || hour < 6) return "quiet-hour";
  if (hour >= 17) return "evening";
  if (hour < 11) return "morning";
  return "day";
}
