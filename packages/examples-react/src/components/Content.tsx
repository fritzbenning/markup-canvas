import ExampleImage from "../assets/example-1.avif";
import { Image } from "./Image";

export function Content() {
  return (
    <>
      <div className="absolute top-[200px] left-[200px]">
        <h1 className="font-bold font-display text-[150px]">Markup Canvas</h1>
        <sup className="-right-[64px] -rotate-16 absolute top-[200px] font-script text-[#808dfd] text-[200px]">beta</sup>
      </div>

      <div className="absolute flex gap-[100px]" style={{ top: 700, left: 200 }}>
        <div className="flex w-[500px] flex-col gap-2 rounded-[32px] bg-[#ffea93] p-10">
          <h2 className="font-display font-semibold text-[28px]">Pure HTML content</h2>
          <p className="font-light text-[22px] leading-[140%]">
            Slam any HTML content or components from your framework of choice onto the canvas.
          </p>
          <p className="font-light text-[22px] leading-[140%]">No worries about performance.</p>
        </div>
        <div className="flex w-[500px] flex-col gap-2 rounded-[32px] bg-[#bac1ff] p-10">
          <h2 className="font-display font-semibold text-[28px]">Navigate like a falcon</h2>
          <p className="font-light text-[22px] leading-[140%]">
            Use your cursor, mouse wheel, keyboard or touch gestures to control the canvas.
          </p>
          <p className="font-light text-[22px] leading-[140%]">Just behave like everywhere else.</p>
        </div>
        <div className="flex w-[500px] flex-col gap-2 rounded-[32px] bg-[#baffde] p-10">
          <h2 className="font-display font-semibold text-[28px]">60+ Frames per second</h2>
          <p className="font-light text-[22px] leading-[140%]">
            Optimized for super-smooth 60fps performance using requestAnimationFrame throttling, batched DOM updates, and GPU-accelerated
            CSS Matrix Transforms.
          </p>
          <p className="font-light text-[22px] leading-[140%]">No worries about performance.</p>
        </div>
      </div>

      <div className="absolute flex gap-[100px]" style={{ bottom: 200, right: 200 }}>
        <h2 className="font-bold font-display text-[#808dfd] text-[200px]">Thanks for exploring!</h2>
      </div>

      <div
        className="absolute h-[4000px] w-[4000px] bg-[radial-gradient(circle,rgba(255,234,147,0.2)_0%,rgba(255,234,147,0)_80%)]"
        style={{ top: 500, left: 1000 }}
      />
      <div
        className="absolute h-[4000px] w-[4000px] bg-[radial-gradient(circle,rgba(186,193,255,0.2)_0%,rgba(186,193,255,0)_80%)]"
        style={{ bottom: 0, right: 1000 }}
      />

      <div className="absolute flex gap-[100px]" style={{ top: 7000, left: 7000 }}>
        <blockquote className="max-w-[1500px] text-center font-script text-[300px] leading-[0.9]">
          "Don't Make Me Think"
          <cite className="mt-6 block font-content font-normal text-[#808dfd] text-[32px] not-italic">Steve Krug</cite>
        </blockquote>
      </div>

      <Image src={ExampleImage} width={1200} height={800} left={2000} top={2000} alt="My description" />
    </>
  );
}
