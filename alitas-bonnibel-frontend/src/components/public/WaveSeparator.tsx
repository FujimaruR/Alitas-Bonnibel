type Props = {
  topColor?: string;    // color “de arriba”
  bottomColor?: string; // color “de abajo”
  flip?: boolean;       // para invertir la ola
};

export function WaveSeparator({
  topColor = "#ffffff",
  bottomColor = "#f8fafc",
  flip = false,
}: Props) {
  return (
    <div style={{ backgroundColor: topColor }} className="leading-[0]">
      <svg
        className={flip ? "rotate-180" : ""}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        width="100%"
        height="120"
      >
        <path
          fill={bottomColor}
          d="M0,96L60,80C120,64,240,32,360,37.3C480,43,600,85,720,90.7C840,96,960,64,1080,48C1200,32,1320,32,1380,32L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
        />
      </svg>
    </div>
  );
}
