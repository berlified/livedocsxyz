"use client";

import * as React from "react";

import { useChartReactions, type ChartEmotion } from "@/components/ui/chart-reactions";

export function usePreviewEmotion(): ChartEmotion | undefined {
  const settings = useChartReactions();
  if (settings.isLoading) return undefined;
  return settings.reaction?.emotion;
}

export function shapeValues(values: number[], emotion?: ChartEmotion, integers = false, preserveSign = false): number[] {
  if (!emotion || values.length === 0) return values;
  const n = values.length;
  const mean = values.reduce((sum, value) => sum + value, 0) / n;
  const shaped = values.map((value, index) => {
    const sign = preserveSign && value < 0 ? -1 : 1;
    const magnitude = Math.abs(value);
    const t = n === 1 ? 1 : index / (n - 1);
    switch (emotion) {
      case "sad":
        return sign * magnitude * (1 - 0.55 * t);
      case "disappointed":
        return sign * magnitude * (1 - 0.2 * t);
      case "neutral":
        return sign === -1 ? -Math.abs(mean) : mean;
      case "happy":
        return sign * magnitude * (0.85 + 0.5 * t);
      case "surprised":
        return sign * magnitude * (t > 0.8 ? 1 + (t - 0.8) * 4 : 1 - 0.05 * t);
      case "proud":
        return sign * magnitude * (0.7 + 0.8 * t);
      default:
        return value;
    }
  });
  return shaped.map((value) => {
    const rounded = integers ? Math.round(value) : Math.round(value * 100) / 100;
    return preserveSign ? rounded : Math.max(0, rounded);
  });
}

export function shapeRecords<T extends Record<string, unknown>>(
  rows: T[],
  keys: string[],
  emotion?: ChartEmotion,
  integers = false,
  preserveSign = false
): T[] {
  if (!emotion || rows.length === 0) return rows;
  const shaped = keys.map((key) => shapeValues(rows.map((row) => Number(row[key]) || 0), emotion, integers, preserveSign));
  return rows.map((row, index) => {
    const next = { ...row };
    keys.forEach((key, keyIndex) => {
      (next as Record<string, unknown>)[key] = shaped[keyIndex]![index];
    });
    return next;
  });
}

export function useShapedRecords<T extends Record<string, unknown>>(
  rows: T[],
  keys: string[],
  integers = false,
  preserveSign = false
): { data: T[]; emotion: ChartEmotion | undefined } {
  const emotion = usePreviewEmotion();
  const key = keys.join(",");
  const data = React.useMemo(
    () => shapeRecords(rows, key.split(","), emotion, integers, preserveSign),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, emotion, integers, preserveSign, key]
  );
  return { data, emotion };
}

export function sumKey<T extends Record<string, unknown>>(rows: T[], key: string): number {
  return rows.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
}

export function money(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function feedFor(emotion?: ChartEmotion): { drift: number; vol: number; seed: number } {
  switch (emotion) {
    case "sad":
      return { drift: -0.002, vol: 0.01, seed: 911 };
    case "disappointed":
      return { drift: -0.0008, vol: 0.006, seed: 922 };
    case "neutral":
      return { drift: 0, vol: 0.002, seed: 933 };
    case "happy":
      return { drift: 0.002, vol: 0.008, seed: 944 };
    case "surprised":
      return { drift: 0.001, vol: 0.03, seed: 955 };
    case "proud":
      return { drift: 0.003, vol: 0.006, seed: 966 };
    default:
      return { drift: 0.0004, vol: 0.006, seed: 11 };
  }
}

export function moverShift(emotion?: ChartEmotion): number {
  switch (emotion) {
    case "sad":
      return -6;
    case "disappointed":
      return -2;
    case "neutral":
      return -0.2;
    case "happy":
      return 4;
    case "surprised":
      return 9;
    case "proud":
      return 12;
    default:
      return 0;
  }
}
