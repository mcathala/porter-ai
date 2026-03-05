export default function GradientDivider() {
  return (
    <div className="relative my-2">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="h-6 bg-gradient-to-b from-primary/[0.06] to-transparent" />
    </div>
  );
}
