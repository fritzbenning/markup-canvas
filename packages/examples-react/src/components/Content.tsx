import ExampleImage from "../assets/example-1.avif";
import { Image } from "./Image";

export function Content() {
  return (
    <>
      <div className="intro">
        <h1 className="headline-font">Markup Canvas</h1>
        <sup className="decorative-font beta">beta</sup>
      </div>

      <div className="canvas-container" style={{ top: 700, left: 200 }}>
        <div className="feature yellow">
          <h2>Pure HTML content</h2>
          <p>Slam any HTML content or components from your framework of choice onto the canvas.</p>
          <p>No worries about performance.</p>
        </div>
        <div className="feature lilac">
          <h2>Navigate like a falcon</h2>
          <p>Use your cursor, mouse wheel, keyboard or touch gestures to control the canvas.</p>
          <p>Just behave like everywhere else.</p>
        </div>
        <div className="feature green">
          <h2>60+ Frames per second</h2>
          <p>
            Optimized for super-smooth 60fps performance using requestAnimationFrame throttling, batched DOM updates, and GPU-accelerated
            CSS Matrix Transforms.
          </p>
          <p>No worries about performance.</p>
        </div>
      </div>

      <div className="canvas-container" style={{ bottom: 200, right: 200 }}>
        <h2 className="hero-headline">Thanks for exploring!</h2>
      </div>

      <div className="gradient yellow" style={{ top: 500, left: 1000 }} />
      <div className="gradient lilac" style={{ bottom: 0, right: 1000 }} />

      <div className="canvas-container" style={{ top: 7000, left: 7000 }}>
        <blockquote className="blockquote">
          "Don't Make Me Think"
          <cite>Steve Krug</cite>
        </blockquote>
      </div>

      <Image src={ExampleImage} width={1200} height={800} left={2000} top={2000} alt="My description" />
    </>
  );
}
