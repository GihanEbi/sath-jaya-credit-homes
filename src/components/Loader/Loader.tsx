type LoaderProps = {
  size?: number;
  className?: string;
};

export function Loader({ size = 24, className = "" }: LoaderProps) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-muted-foreground border-t-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
