/**
 * Transform-related type definitions
 */

import type { Transform } from "./canvas.js";

export interface SafeTransformOptions {
	logErrors?: boolean;
	logWarnings?: boolean;
	useRepair?: boolean;
	fallbackToIdentity?: boolean;
}

export interface SafeTransformResult {
	success: boolean;
	usedFallback: boolean;
	errors: string[];
	warnings: string[];
}
