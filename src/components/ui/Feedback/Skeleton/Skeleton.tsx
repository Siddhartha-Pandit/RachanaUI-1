import "./Skeleton.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
}

export default function Skeleton({
  width = "100%",
  height = "20px",
  radius = "var(--radius-md)",
}: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: radius,
      }}
    />
  );
}