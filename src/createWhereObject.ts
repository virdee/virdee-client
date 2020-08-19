export function createWhereObject(
  query: Record<string, unknown>
): Record<string, unknown> {
  return { where: { ...query } };
}
