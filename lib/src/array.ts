export const repeat = <T>(
  n: number,
  valueOrFn: ((index: number) => T) | T = {} as T,
) =>
  Array(n)
    .fill(0)
    .map((_, index) =>
      valueOrFn instanceof Function ? valueOrFn(index) : valueOrFn,
    );

export const zip = <T, U>(
  array1: T[],
  array2: U[],
): { first: T; second: U }[] => {
  const minLength = Math.min(array1.length, array2.length);
  const result: { first: T; second: U }[] = [];

  for (let i = 0; i < minLength; i++) {
    // biome-ignore lint/style/noNonNullAssertion: Array access is safe here
    result.push({ first: array1[i]!, second: array2[i]! });
  }

  return result;
};
