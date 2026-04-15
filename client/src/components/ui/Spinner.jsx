const Spinner = ({ size = 20, color = "var(--accent)" }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid var(--border)`,
    borderTop: `2px solid ${color}`,
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    flexShrink: 0,
  }} />
);

export default Spinner;