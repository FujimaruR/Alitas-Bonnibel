type Props = {
  id: string;

  /** colores del gradiente */
  from: string;
  to: string;

  /** color de la sección de abajo */
  bottomColor: string;

  /** invierte la ola (forma) */
  flipWave?: boolean;

  /** invierte el gradiente (para que sea espejo del de arriba) */
  flipGradient?: boolean;

  /** ángulo del gradiente en grados, ej: 135 */
  angle?: number;

  height?: number;
};

export function WaveSeparatorGradient({
  id,
  from,
  to,
  bottomColor,
  flipWave = false,
  flipGradient = false,
  angle = 135,
  height = 120,
}: Props) {
  // Si flipGradient, intercambiamos from/to para “espejo”
  const a = flipGradient ? to : from;
  const b = flipGradient ? from : to;

  return (
    <div
      className="leading-[0]"
      style={{
        background: `linear-gradient(${angle}deg, ${a}, ${b})`,
      }}
    >
      <svg
        className={flipWave ? "rotate-180" : ""}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        width="100%"
        height={height}
      >
        {/* la ola “deja ver” la sección de abajo */}
        <path
          fill={bottomColor}
          d="M0,80 C120,110 360,110 720,80 1080,50 1320,60 1440,70 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
