import { useEffect, useRef, useState } from "react";

type Options = IntersectionObserverInit & {
  once?: boolean;
};

export function useInView(options: Options = {}) {
  const { once = true, root = null, rootMargin = "0px", threshold = 0 } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (once) obs.disconnect();
      } else if (!once) {
        setIsVisible(false);
      }
    }, { root, rootMargin, threshold });

    obs.observe(el);
    return () => obs.disconnect();
  }, [once, root, rootMargin, threshold]);

  return { ref, isVisible };
}
