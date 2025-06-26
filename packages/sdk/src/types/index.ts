/**
 * This module contains all types related to the Extended API.
 *
 * @example
 * ```ts
 * import type { OrderParams } from "@rokitgg/extended/types";
 *
 * const myOrder: OrderParams = {
 *   a: 0, // Asset index
 *   b: true, // Buy order
 *   p: "30000", // Price
 *   s: "0.1", // Size
 *   r: false, // Not reduce-only
 *   t: {
 *     limit: {
 *       tif: "Gtc", // Good-til-cancelled
 *     },
 *   },
 * };
 * ```
 *
 * @module
 */

export type Hex = `0x${string}`;

// Base types
export type MaybePromise<T> = T | Promise<T>;

// Info types
export * from "./info/markets";
export * from "./info/candles";
export * from "./info/funding";
export * from "./info/open-interest";
export * from "./info/requests";
