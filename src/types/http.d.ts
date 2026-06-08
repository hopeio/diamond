export type Decode<T = any> = ((input: Uint8Array, length?: number) => T) | { decode: (input: Uint8Array, length?: number) => T }

export type Stream<T = any> =
	((input: ReadableStream<Uint8Array> | null) => Promise<T>) | { stream: (input: ReadableStream<Uint8Array> | null) => Promise<T> }