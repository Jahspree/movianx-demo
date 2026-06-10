"use client";
import { useEffect, useReducer } from "react";
import { emotionEngine } from "./EmotionEngine.js";

/**
 * React hook — subscribes to EmotionEngine and re-renders on every state change.
 * Returns the current emotion state snapshot.
 *
 * @returns {{ tension: number, chapter: number, storyId: any, beatIndex: number, phase: string }}
 *
 * Usage:
 *   const { tension, phase } = useEmotionEngine();
 */
export function useEmotionEngine() {
  // forceUpdate via useReducer — cheap, no closure over stale state
  const [, tick] = useReducer(n => n + 1, 0);

  useEffect(() => {
    // Subscribe immediately; listener fires on every state change
    const unsub = emotionEngine.subscribe(tick);
    return unsub;
  }, []);

  return emotionEngine.getState();
}

/**
 * Selector variant — only re-renders when the selected value changes.
 * Avoids re-renders from unrelated state fields.
 *
 * @param {function(state): any} selector
 * @returns {any}
 *
 * Usage:
 *   const tension = useEmotionEngineSelector(s => s.tension);
 */
export function useEmotionEngineSelector(selector) {
  const [selected, dispatch] = useReducer((prev, next) => {
    // Only trigger render if the selected slice changed
    return Object.is(prev, next) ? prev : next;
  }, selector(emotionEngine.getState()));

  useEffect(() => {
    const unsub = emotionEngine.subscribe(state => {
      dispatch(selector(state));
    });
    return unsub;
  }, [selector]);

  return selected;
}
