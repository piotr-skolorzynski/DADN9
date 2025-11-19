export function isEnumValue<T extends object>(
  enumObj: Text,
  value: string
): boolean {
  return Object.values(enumObj).includes(value as unknown as T[keyof T]);
}
