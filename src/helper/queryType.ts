/* eslint-disable @typescript-eslint/no-explicit-any */
export type InferQueryType<T extends (...args: any) => any> = NonNullable<Awaited<ReturnType<T>>>