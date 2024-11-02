import { useCallback, useEffect } from "react";

export default function useDebounce({ effect, dependency, delay }: any) {
  const callback = useCallback(effect, dependency);
  useEffect(() => {
    const timeout = setTimeout(callback, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [callback, delay]);
}
