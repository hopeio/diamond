import {BinaryReader, BinaryWriter} from "@bufbuild/protobuf/wire";

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
    : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

export interface CommonResp<T> {
    code: number;
    msg: string;
    data: T;
}


export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number):T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}


export function CommonRespDecode<T>(messageFns: MessageFns<T>): CommonRespDecodeFn<T> {
    return {
        decode(input: BinaryReader | Uint8Array, length?: number): CommonResp<T> {
            const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
            const end = length === undefined ? reader.len : reader.pos + length;
            // 这里使用传入的 messageFns 来解码数据部分
            const commonResp: CommonResp<T> = {
                code: 0,
                msg: "",
                data: undefined as T
            };

            while (reader.pos < end) {
                const tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        if (tag !== 8) {
                            break;
                        }
                        commonResp.code = reader.int32();
                        continue;
                    }
                    case 2: {
                        if (tag !== 18) {
                            break;
                        }
                        commonResp.msg = reader.string();
                        continue;
                    }
                    case 3: {
                        if (tag !== 26) {
                            break;
                        }
                        // 使用提供的 messageFns 来解码数据部分
                        commonResp.data = messageFns.decode(reader, reader.uint32());
                        continue;
                    }
                }
                if ((tag & 7) === 4 || tag === 0) {
                    break;
                }
                reader.skip(tag & 7);
            }
            return commonResp;
        }
    };
}

export interface CommonRespDecodeFn<T> {
    decode(input: BinaryReader | Uint8Array, length?: number): CommonResp<T>;
}