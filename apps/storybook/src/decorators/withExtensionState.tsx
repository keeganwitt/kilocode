import type { Decorator } from "@storybook/react-vite"
import { ExtensionStateContext } from "../../../../webview-ui/src/context/ExtensionStateContext"
import { createExtensionStateMock } from "../utils/createExtensionStateMock"

const mockExtensionState = createExtensionStateMock()

// Decorator to provide ExtensionStateContext for all stories
//
// To override specific properties in a story, use the parameters:
// export const MyStory = {
//   parameters: {
//     extensionState: {
//       showTaskTimeline: false,
//       clineMessages: [/* custom messages */]
//     }
//   }
// }
export const withExtensionState: Decorator = (Story, context) => {
	const storyOverrides = context.parameters?.extensionState || {}
	// Create a new Proxy that merges overrides with the base mock
	// This ensures the Proxy's get trap is always invoked
	const contextValue = createExtensionStateMock(storyOverrides)

	return (
		<ExtensionStateContext.Provider value={contextValue}>
			<Story />
		</ExtensionStateContext.Provider>
	)
}
