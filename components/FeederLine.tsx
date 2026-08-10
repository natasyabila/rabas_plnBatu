export default function FeederLine({ nodes = 9 }: { nodes?: number }) {
  const width = 1060;
  const points = Array.from({ length: nodes }, (_, i) => {
    const x = 20 + (i * (width - 40)) / (nodes - 1);
    return x;
  });

  return (
    <svg
      viewBox={`0 0 ${width} 24`}
      width="100%"
      height="24"
      role="img"
      aria-label="Ilustrasi jaringan penyulang"
      style={{ display: "block", marginBottom: 8 }}
    >
      <line
        x1={20}
        y1={12}
        x2={width - 20}
        y2={12}
        stroke="var(--border-strong)"
        strokeWidth={2}
      />
      {points.map((x, i) => (
        <circle key={i} cx={x} cy={12} r={4} fill="var(--accent)" />
      ))}
    </svg>
  );
}
