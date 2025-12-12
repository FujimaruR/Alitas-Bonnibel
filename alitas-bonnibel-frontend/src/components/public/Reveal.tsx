import type { ReactNode } from "react";
import { useInView } from "../../hooks/useInView";

type Props = {
  children: ReactNode;
  delayMs?: number;
  className?: string;
};

export function Reveal({ children, delayMs = 0, className = "" }: Props) {
  const { ref, isVisible } = useInView({
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px",
    once: true,
  });

  return (
    <div
      ref={ref as any}
      className={`anim-reveal ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
