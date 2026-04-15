import { MarkupCanvas } from "@markup-canvas/react";
import { Content } from "../components/Content";
import { MARKUP_CONFIG } from "./config";

export default function SimpleExample() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-[#f6f6f6]">
      <MarkupCanvas
        {...MARKUP_CONFIG}
        onReady={(canvas) => {
          console.log("✅ [component] Canvas ready", canvas);
        }}
        style={{ flex: 1, minHeight: 0, width: "100%", height: "100%" }}
      >
        <Content />
      </MarkupCanvas>
    </main>
  );
}
