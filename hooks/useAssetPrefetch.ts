"use client";

import { useEffect, useState } from "react";

type PrefetchState = {
  urls: Record<string, string>; // original src → blob: URL
  ready: boolean;
};

export function useAssetPrefetch(srcs: string[]): PrefetchState {
  const [state, setState] = useState<PrefetchState>({ urls: {}, ready: false });

  useEffect(() => {
    const srcList = srcs.filter(Boolean);
    if (srcList.length === 0) return;

    let cancelled = false;
    const objectUrls: string[] = [];

    Promise.all(
      srcList.map(async (src) => {
        const res = await fetch(src, {mode: "cors", cache: "no-store"});
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        objectUrls.push(objectUrl);
        return [src, objectUrl] as [string, string];
      }),
    ).then((entries) => {
      if (cancelled) {
        objectUrls.forEach(URL.revokeObjectURL);
        return;
      }
      setState({ urls: Object.fromEntries(entries), ready: true });
    });

    return () => {
      cancelled = true;
      objectUrls.forEach(URL.revokeObjectURL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetch once on mount, never again

  return state;
}
