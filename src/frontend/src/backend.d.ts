import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WishInput {
    username: string;
    message: string;
}
export type Time = bigint;
export interface WishOutput {
    username: string;
    message: string;
    timestamp: Time;
}
export interface backendInterface {
    getAllWishes(): Promise<Array<WishOutput>>;
    submitWish(input: WishInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "error";
        error: string;
    }>;
}
