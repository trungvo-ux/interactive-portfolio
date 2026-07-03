const TEXT = "We are in the Future";

export function DitherFlyTitle() {
  return (
    <h2 className="dither-title relative text-center font-sans text-[clamp(48px,8vw,96px)] font-medium leading-none tracking-[-0.04em] text-black">
      {TEXT}
    </h2>
  );
}
