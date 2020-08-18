export function createDataObject(
  query: Record<string, unknown>
): Record<string, unknown> {
  return { data: { ...query } };
}
