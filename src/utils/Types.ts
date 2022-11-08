import { AnyDataValue, AnyDate, AnyNumber, LuxonKey } from "../api-types/Types";

export type NumberFormatter = (n: AnyNumber) => string;
export type DateFormatter = (n: AnyDate) => string;
export type ValueFormatter = (n: AnyDataValue) => string;

export interface NumberFormatOptions {
  decimals?: number;
  measure?: string;
}

export interface DateFormatOptions {
  level?: LuxonKey;
  format?: string;
}

export interface FormatterFactory {
  getNumberFormatter: (options: NumberFormatOptions) => ValueFormatter;
  getDateFormatter: (options: DateFormatOptions) => ValueFormatter;
}
