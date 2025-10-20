# MarkupCanvas Architecture - Refactoring Plan

## Current Architecture (Before Refactoring)

```
┌─────────────────────────────────────────────────────────┐
│                    MarkupCanvas (568 lines)              │
├─────────────────────────────────────────────────────────┤
│  Properties:                                             │
│  • baseCanvas: BaseCanvas                               │
│  • config: MarkupCanvasConfig                           │
│  • rulers, dragSetup, listen, etc.                      │
│                                                          │
│  Window Management (62 lines)                           │
│  • setupGlobalBinding()                                 │
│  • cleanupGlobalBinding()                               │
│  • broadcastEvent()                                     │
│                                                          │
│  Transform Operations (75+ lines)                       │
│  • Pan: panLeft, panRight, panUp, panDown             │
│  • Zoom: zoomIn, zoomOut, setZoom, zoomToPoint, etc.  │
│  • emitTransformEvents()                               │
│                                                          │
│  UI Controls (66 lines)                                 │
│  • Grid: toggleGrid, showGrid, hideGrid, etc.         │
│  • Rulers: toggleRulers, showRulers, hideRulers, etc. │
│                                                          │
│  View Utilities (40 lines)                             │
│  • getVisibleArea()                                    │
│  • isPointVisible()                                    │
│  • centerContent()                                     │
│  • scrollToPoint()                                     │
│  • fitToScreen()                                       │
│                                                          │
│  Mouse Control (6 lines)                               │
│  • enableMouseDrag()                                   │
│  • disableMouseDrag()                                  │
│  • isMouseDragEnabled()                                │
│                                                          │
│  Configuration (20 lines)                              │
│  • getConfig()                                         │
│  • updateConfig()                                      │
│  • updateThemeMode()                                   │
│                                                          │
│  Event Setup (41 lines)                                │
│  • setupEventHandlers()                                │
│                                                          │
│  Lifecycle (28 lines)                                  │
│  • cleanup()                                           │
│  • destroy()                                           │
│                                                          │
│  Getters & Delegation (60+ lines)                      │
│  • container, transformLayer, contentLayer, etc.       │
│  • BaseCanvas method delegation                        │
└─────────────────────────────────────────────────────────┘
            ▼
    ┌──────────────────┐
    │   BaseCanvas     │
    │  (Core Logic)    │
    └──────────────────┘
```

## Proposed Architecture (After Refactoring)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MarkupCanvas (150-200 lines)                         │
│              [ORCHESTRATION & COMPOSITION ONLY]                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  constructor() {                                                        │
│    // Initialize baseCanvas                                            │
│    // Setup window binding  ──────────┐                                │
│    // Create method groups ─────────┐ │                                │
│    // Setup event handlers ───────┐ │ │                                │
│    // Setup lifecycle ──────────┐ │ │ │                                │
│  }                              │ │ │ │                                │
│                                 ▼ ▼ ▼ ▼                                │
└────────────────────────────────────────────────────────────────────────┘
    │         │         │         │         │         │         │
    │         │         │         │         │         │         │
    ▼         ▼         ▼         ▼         ▼         ▼         ▼
 ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
 │Window│ │ Pan  │ │ Zoom │ │  UI  │ │ View │ │Mouse │ │Config│
 │Binding│ │Ops   │ │Ops   │ │Ctrls │ │Utils │ │Ctrls │ │Mgmt  │
 └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
   /\       /\       /\       /\       /\       /\       /\
   │        │        │        │        │        │        │
   │        │        │        │        │        │        └─ updateThemeMode
   │        │        │        │        │        │
   │        │        │        │        │        └─ isMouseDragEnabled
   │        │        │        │        │           disableMouseDrag
   │        │        │        │        │           enableMouseDrag
   │        │        │        │        │
   │        │        │        │        └─ scrollToPoint
   │        │        │        │           fitToScreen
   │        │        │        │           centerContent
   │        │        │        │           isPointVisible
   │        │        │        │           getVisibleArea
   │        │        │        │
   │        │        │        └─ rulerControls (8 methods)
   │        │        │           gridControls (4 methods)
   │        │        │
   │        │        └─ resetViewToCenter
   │        │           zoomToFitContent
   │        │           zoomToPoint
   │        │           zoomOut (factor-based)
   │        │           zoomIn (factor-based)
   │        │           resetZoom
   │        │           setZoom
   │        │
   │        └─ panDown
   │           panUp
   │           panRight
   │           panLeft
   │
   └─ broadcastEvent
      cleanupGlobalBinding
      setupGlobalBinding


                    ┌──────────────────────┐
                    │   Shared Utilities    │
                    ├──────────────────────┤
                    │ emitTransformEvents  │
                    │ setupEventHandlers   │
                    │ cleanup/destroy      │
                    └──────────────────────┘
                            ▲
                            │ (used by all modules)
                            │
                    ┌───────┴────────┐
                    │   BaseCanvas   │
                    │  (Core Logic)  │
                    └────────────────┘
```

## Detailed Module Breakdown

### 1. Window Binding Module (`lib/canvas/window/`)
```
setupGlobalBinding(canvas, config)
  ├─ Bind instance to window[name]
  └─ Track in window.__markupCanvasInstances

cleanupGlobalBinding(canvas, config)
  ├─ Remove from window[name]
  └─ Remove from instances map

broadcastEvent(event, data, config)
  ├─ Send to window via postMessage
  └─ Send to window.parent via postMessage
```

### 2. Pan Module (`lib/canvas/pan/`)
```
createPanMethods(baseCanvas, config, updateTransform, emitEvents)
  ├─ panLeft(distance)
  ├─ panRight(distance)
  ├─ panUp(distance)
  └─ panDown(distance)
```

### 3. Zoom Module (`lib/canvas/zoom/`)
```
createZoomMethods(canvas, baseCanvas, config, emitEvents)
  ├─ zoomIn(factor)
  ├─ zoomOut(factor)
  ├─ setZoom(level)
  ├─ zoomToPoint(x, y, scale)
  ├─ zoomToFitContent()
  ├─ resetView()
  └─ resetViewToCenter()
```

### 4. UI Controls Module (`lib/canvas/ui/`)
```
createGridControls(rulers)
  ├─ toggleGrid()
  ├─ showGrid()
  ├─ hideGrid()
  └─ isGridVisible()

createRulerControls(rulers)
  ├─ toggleRulers()
  ├─ showRulers()
  ├─ hideRulers()
  └─ areRulersVisible()
```

### 5. View Utils Module (`lib/canvas/view/`)
```
createViewMethods(canvas, baseCanvas, config)
  ├─ getVisibleArea()
  ├─ isPointVisible(x, y)
  ├─ centerContent()
  ├─ scrollToPoint(x, y)
  └─ fitToScreen()
```

### 6. Mouse Controls Module (`lib/canvas/mouse/`)
```
createMouseDragControls(dragSetup)
  ├─ enableMouseDrag()
  ├─ disableMouseDrag()
  └─ isMouseDragEnabled()
```

### 7. Events Module (`lib/canvas/events/`)
```
emitTransformEvents(listen, baseCanvas)
  ├─ emit("transform", transform)
  ├─ emit("zoom", scale)
  └─ emit("pan", {x, y})
```

### 8. Config Module (`lib/canvas/config/`)
```
getConfig(config)
  └─ Return copy of config

updateConfig(config, newConfig)
  └─ Merge and recreate config

updateThemeMode(mode, canvas, config, baseCanvas, rulers)
  ├─ Update config
  ├─ Update container background
  └─ Update rulers theme
```

### 9. Setup Module (`lib/canvas/setup/`)
```
setupEventHandlers(canvas, config, baseCanvas)
  ├─ Wheel events
  ├─ Mouse events
  ├─ Keyboard events
  ├─ Touch events
  └─ Rulers
  └─ Return cleanup functions
```

### 10. Lifecycle Module (`lib/canvas/lifecycle/`)
```
cleanup(canvas)
  ├─ Remove global binding
  ├─ Cleanup postMessage
  ├─ Call cleanup functions
  └─ Remove listeners

destroy(canvas)
  ├─ cleanup()
  └─ Clear transition timeouts
```

---

## Data Flow Example: User Pans Left

### Before (Tightly Coupled)
```
User Pan Left
    ▼
MarkupCanvas.panLeft()
    ▼
updateTransform({ translateX: ... })
    ▼
baseCanvas.updateTransform()
    ▼
MarkupCanvas.emitTransformEvents()
    ▼
listen.emit("pan", {...})
```

### After (Clear Separation)
```
User Pan Left
    ▼
MarkupCanvas.panLeft()
    ▼
panMethods.panLeft() [from lib/canvas/pan/]
    ▼
this.updateTransform() [MarkupCanvas]
    ▼
baseCanvas.updateTransform()
    ▼
emitTransformEvents() [from lib/canvas/events/]
    ▼
listen.emit("pan", {...})
```

---

## Implementation Checklist

### Phase 1: Easy Wins
- [ ] Extract `lib/canvas/events/emitTransformEvents.ts`
- [ ] Extract `lib/canvas/mouse/createMouseDragControls.ts`
- [ ] Extract `lib/canvas/window/` (3 files)
- [ ] Extract `lib/canvas/config/` (3 files)
- [ ] Update imports in MarkupCanvas

### Phase 2: Method Groups
- [ ] Extract `lib/canvas/ui/` (2 files)
- [ ] Extract `lib/canvas/view/` (1 file)
- [ ] Extract `lib/canvas/pan/` (1 file)
- [ ] Update method delegates in MarkupCanvas

### Phase 3: Complex Orchestration
- [ ] Extract `lib/canvas/zoom/` (1 file)
- [ ] Extract `lib/canvas/setup/` (1 file)
- [ ] Extract `lib/canvas/lifecycle/` (2 files)
- [ ] Final refactor of MarkupCanvas

### Quality Assurance
- [ ] Update unit tests
- [ ] Verify exports in `lib/canvas/index.ts`
- [ ] Test all public API methods
- [ ] Check TypeScript compilation
- [ ] Verify no runtime errors

