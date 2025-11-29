type Props = { size?: number; color?: string; className?: string };
export function Spinner({ size = 18, color = '#1f444c', className = '' }: Props) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderTopColor: color,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  };
  return (
    <span
      className={`inline-block align-middle rounded-full animate-spin border-2 ${className}`}
      style={style}
      aria-label="Loading"
      role="status"
    />
  );
}
