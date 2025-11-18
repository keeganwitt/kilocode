import type { ExtensionStateContextType } from "../../../../webview-ui/src/context/ExtensionStateContext"
import { createDefaultExtensionState } from "./extensionStateDefaults"

/**
 * Creates a mock ExtensionStateContextType for Storybook
 *
 * Uses real defaults from ExtensionStateContextProvider and merges story-specific overrides.
 * This ensures Storybook always matches production defaults.
 *
 * @param overrides - Story-specific overrides to merge on top of defaults
 * @returns Complete ExtensionStateContextType with defaults and overrides merged
 */
export const createExtensionStateMock = (
	overrides: Partial<ExtensionStateContextType> = {},
): ExtensionStateContextType => {
	const defaults = createDefaultExtensionState()

	// Merge overrides on top of defaults (shallow merge)
	return {
		...defaults,
		...overrides,
	} as ExtensionStateContextType
}
