import { useEffect, useRef, useState } from "react";

type Options = IntersectionObserverInit & {
  once?: boolean;
};

export function useInView(options: Options = {}) {
  const { once = true, ...io } = options;
  const ref = useRef<HTMLElement | null>(null);
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
    }, io);

    obs.observe(el);
    return () => obs.disconnect();
  }, [once, io.root, io.rootMargin, io.threshold]);

  return { ref, isVisible };
}
