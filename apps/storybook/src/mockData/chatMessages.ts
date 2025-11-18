import { ClineMessage } from "@roo-code/types"
import { BASE_TIMESTAMP } from "./clineMessages"

/**
 * Message factory functions for creating individual chat messages
 * Used for Storybook stories to showcase different message types and states
 */

// Helper to create a message with timestamp offset
const createMessage = (message: Omit<ClineMessage, "ts">, tsOffset: number = 0): ClineMessage => ({
	...message,
	ts: BASE_TIMESTAMP + tsOffset,
})

// ============================================================================
// ASK MESSAGE FACTORIES
// ============================================================================

export const createFollowupMessage = (
	options: {
		partial?: boolean
		withSuggestions?: boolean
		question?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { partial = false, withSuggestions = true, question, tsOffset = 1000 } = options

	const suggestions = withSuggestions
		? [
				{ answer: "Yes, please add error handling", mode: undefined },
				{ answer: "No, keep it simple", mode: undefined },
				{ answer: "Add error handling and logging", mode: undefined },
			]
		: []

	const followUpData = {
		question: question || "Would you like me to add error handling to this component?",
		suggest: suggestions,
	}

	return createMessage(
		{
			type: "ask",
			ask: "followup",
			text: JSON.stringify(followUpData),
			partial,
		},
		tsOffset,
	)
}

export const createCommandMessage = (
	options: {
		command?: string
		partial?: boolean
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { command = "npm install react react-dom", partial = false, tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "command",
			text: command,
			partial,
		},
		tsOffset,
	)
}

export const createCommandOutputMessage = (
	options: {
		output?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { output = "Command output here...", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "command_output",
			text: output,
		},
		tsOffset,
	)
}

export const createToolMessage = (
	options: {
		tool?:
			| "editedExistingFile"
			| "appliedDiff"
			| "newFileCreated"
			| "insertContent"
			| "readFile"
			| "codebaseSearch"
			| "fetchInstructions"
			| "listFilesTopLevel"
			| "listFilesRecursive"
			| "listCodeDefinitionNames"
			| "searchFiles"
			| "switchMode"
			| "newTask"
			| "finishTask"
			| "generateImage"
			| "runSlashCommand"
			| "updateTodoList"
		path?: string
		content?: string
		diff?: string
		isProtected?: boolean
		isOutsideWorkspace?: boolean
		lineNumber?: number
		query?: string
		regex?: string
		mode?: string
		reason?: string
		partial?: boolean
		batchFiles?: Array<{
			path: string
			lineSnippet: string
			isOutsideWorkspace?: boolean
			key: string
			content?: string
		}>
		batchDiffs?: Array<{
			path: string
			changeCount: number
			key: string
			content: string
			diffs?: Array<{ content: string; startLine?: number }>
		}>
		fastApplyResult?: { description?: string; tokensIn?: number; tokensOut?: number; cost?: number }
		additionalFileCount?: number
		tsOffset?: number
	} = {},
): ClineMessage => {
	const {
		tool = "editedExistingFile",
		path = "src/components/Example.tsx",
		content,
		diff,
		isProtected = false,
		isOutsideWorkspace = false,
		lineNumber = 10,
		query = "user authentication",
		regex = ".*\\.ts$",
		mode = "code",
		reason,
		partial = false,
		batchFiles,
		batchDiffs,
		fastApplyResult,
		additionalFileCount,
		tsOffset = 1000,
	} = options

	const toolData: any = {
		tool,
		path,
	}

	if (content) toolData.content = content
	if (diff) toolData.diff = diff
	if (isProtected) toolData.isProtected = true
	if (isOutsideWorkspace) toolData.isOutsideWorkspace = true
	if (lineNumber !== undefined) toolData.lineNumber = lineNumber
	if (query) toolData.query = query
	if (regex) toolData.regex = regex
	if (mode) toolData.mode = mode
	if (reason) toolData.reason = reason
	if (batchFiles) toolData.batchFiles = batchFiles
	if (batchDiffs) toolData.batchDiffs = batchDiffs
	if (fastApplyResult) toolData.fastApplyResult = fastApplyResult
	if (additionalFileCount !== undefined) toolData.additionalFileCount = additionalFileCount

	// Add tool-specific defaults
	if (tool === "editedExistingFile" || tool === "appliedDiff") {
		if (!diff && !content) {
			toolData.diff = `--- a/${path}\n+++ b/${path}\n@@ -1,3 +1,4 @@\n import React from 'react'\n+\n+export const Example = () => <div>Example</div>`
		}
	}

	if (tool === "newFileCreated" || tool === "insertContent") {
		if (!content && !diff) {
			toolData.content = `import React from 'react'\n\nexport const Example = () => {\n  return <div>Example Component</div>\n}`
		}
	}

	if (tool === "readFile" && !content) {
		toolData.content = path
	}

	if (tool === "codebaseSearch" && !query) {
		toolData.query = "user authentication"
	}

	if (tool === "searchFiles" && !regex) {
		toolData.regex = ".*\\.ts$"
	}

	if (tool === "switchMode" && !mode) {
		toolData.mode = "code"
	}

	if (tool === "newTask" && !content) {
		toolData.content = "Create a new feature component"
	}

	if (tool === "runSlashCommand") {
		toolData.command = "/test"
		toolData.args = "--verbose"
		toolData.description = "Run test suite"
		toolData.source = "custom"
	}

	if (tool === "updateTodoList") {
		toolData.todos = [
			{ id: "1", text: "Create component", completed: false },
			{ id: "2", text: "Add tests", completed: false },
			{ id: "3", text: "Update documentation", completed: true },
		]
		toolData.content = "Updated todo list"
	}

	return createMessage(
		{
			type: "ask",
			ask: "tool",
			text: JSON.stringify(toolData),
			partial,
		},
		tsOffset,
	)
}

export const createBrowserActionLaunchMessage = (
	options: {
		action?: string
		partial?: boolean
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { action = "navigate", partial = false, tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "browser_action_launch",
			text: JSON.stringify({ action }),
			partial,
		},
		tsOffset,
	)
}

export const createMcpServerMessage = (
	options: {
		type?: "use_mcp_tool" | "access_mcp_resource"
		serverName?: string
		toolName?: string
		uri?: string
		arguments?: string
		partial?: boolean
		tsOffset?: number
	} = {},
): ClineMessage => {
	const {
		type = "use_mcp_tool",
		serverName = "filesystem",
		toolName = "read_file",
		uri = "file:///path/to/file",
		arguments: args = '{"path": "/example"}',
		partial = false,
		tsOffset = 1000,
	} = options

	const mcpData: any = {
		type,
		serverName,
	}

	if (type === "use_mcp_tool") {
		mcpData.toolName = toolName
		mcpData.arguments = args
	} else {
		mcpData.uri = uri
	}

	return createMessage(
		{
			type: "ask",
			ask: "use_mcp_server",
			text: JSON.stringify(mcpData),
			partial,
		},
		tsOffset,
	)
}

export const createCompletionResultMessage = (
	options: {
		text?: string
		partial?: boolean
		tsOffset?: number
	} = {},
): ClineMessage => {
	const {
		text = "Task completed successfully! I've created a new React component with proper TypeScript typing and error handling.",
		partial = false,
		tsOffset = 1000,
	} = options

	return createMessage(
		{
			type: "ask",
			ask: "completion_result",
			text,
			partial,
		},
		tsOffset,
	)
}

export const createApiReqFailedMessage = (
	options: {
		error?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { error = "API request failed: Connection timeout", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "api_req_failed",
			text: error,
		},
		tsOffset,
	)
}

export const createResumeTaskMessage = (
	options: {
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "resume_task",
			text: "Resume previous task?",
		},
		tsOffset,
	)
}

export const createResumeCompletedTaskMessage = (
	options: {
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "resume_completed_task",
			text: "Task was already completed. Start new task?",
		},
		tsOffset,
	)
}

export const createMistakeLimitReachedMessage = (
	options: {
		error?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { error = "Mistake limit reached. Too many errors encountered.", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "mistake_limit_reached",
			text: error,
		},
		tsOffset,
	)
}

export const createAutoApprovalMaxReqReachedMessage = (
	options: {
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "auto_approval_max_req_reached",
			text: JSON.stringify({
				count: 10,
				limit: 10,
			}),
		},
		tsOffset,
	)
}

export const createPaymentRequiredPromptMessage = (
	options: {
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "payment_required_prompt",
			text: JSON.stringify({
				message: "Low credit warning",
				credits: 0.5,
			}),
		},
		tsOffset,
	)
}

export const createInvalidModelMessage = (
	options: {
		model?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { model = "gpt-3.5-turbo", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "invalid_model",
			text: JSON.stringify({
				model,
				message: `Model ${model} is not available`,
			}),
		},
		tsOffset,
	)
}

export const createReportBugMessage = (
	options: {
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "report_bug",
			text: JSON.stringify({
				title: "Bug Report",
				body: "Description of the bug",
				labels: ["bug"],
			}),
		},
		tsOffset,
	)
}

export const createCondenseMessage = (
	options: {
		context?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { context = "Condensed conversation context", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "ask",
			ask: "condense",
			text: context,
		},
		tsOffset,
	)
}

// ============================================================================
// SAY MESSAGE FACTORIES
// ============================================================================

export const createTextMessage = (
	options: {
		text?: string
		partial?: boolean
		images?: string[]
		tsOffset?: number
	} = {},
): ClineMessage => {
	const {
		text = "I'll help you with that. Let me analyze the requirements first.",
		partial = false,
		images,
		tsOffset = 1000,
	} = options

	return createMessage(
		{
			type: "say",
			say: "text",
			text,
			partial,
			images,
		},
		tsOffset,
	)
}

export const createReasoningMessage = (
	options: {
		content?: string
		partial?: boolean
		tsOffset?: number
		elapsedMs?: number
		metadata?: Record<string, unknown>
	} = {},
): ClineMessage => {
	const {
		content = "Based on the project structure, I should use functional components with hooks for better performance and maintainability.",
		partial = false,
		tsOffset = 1000,
		elapsedMs,
		metadata = {},
	} = options

	const mergedMetadata =
		elapsedMs !== undefined ? ({ reasoningElapsedMs: elapsedMs, ...metadata } as Record<string, unknown>) : metadata

	return createMessage(
		{
			type: "say",
			say: "reasoning",
			text: content,
			partial,
			metadata: Object.keys(mergedMetadata).length > 0 ? (mergedMetadata as ClineMessage["metadata"]) : undefined,
		},
		tsOffset,
	)
}

export const createApiReqStartedMessage = (
	options: {
		cost?: number
		cancelReason?: string | null
		streamingFailedMessage?: string
		inferenceProvider?: string
		usageMissing?: boolean
		tsOffset?: number
	} = {},
): ClineMessage => {
	const {
		cost,
		cancelReason = undefined,
		streamingFailedMessage,
		inferenceProvider = "anthropic",
		usageMissing = false,
		tsOffset = 1000,
	} = options

	const apiReqInfo: any = {
		provider: inferenceProvider,
		model: "claude-3-5-sonnet-20241022",
	}

	if (cost !== undefined) apiReqInfo.cost = cost
	if (cancelReason !== undefined) apiReqInfo.cancelReason = cancelReason
	if (streamingFailedMessage) apiReqInfo.streamingFailedMessage = streamingFailedMessage
	if (usageMissing) apiReqInfo.usageMissing = usageMissing

	return createMessage(
		{
			type: "say",
			say: "api_req_started",
			text: JSON.stringify(apiReqInfo),
		},
		tsOffset,
	)
}

export const createErrorMessage = (
	options: {
		message?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { message = "Error: TypeScript compilation failed. Missing import statement for React.", tsOffset = 1000 } =
		options

	return createMessage(
		{
			type: "say",
			say: "error",
			text: message,
		},
		tsOffset,
	)
}

export const createDiffErrorMessage = (
	options: {
		message?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { message = "Error applying diff: merge conflict detected", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "diff_error",
			text: message,
		},
		tsOffset,
	)
}

export const createSayCompletionResultMessage = (
	options: {
		text?: string
		partial?: boolean
		tsOffset?: number
	} = {},
): ClineMessage => {
	const {
		text = "All components have been successfully created and tested",
		partial = false,
		tsOffset = 1000,
	} = options

	return createMessage(
		{
			type: "say",
			say: "completion_result",
			text,
			partial,
		},
		tsOffset,
	)
}

export const createUserFeedbackMessage = (
	options: {
		text?: string
		images?: string[]
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { text = "Can you add error handling to this component?", images, tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "user_feedback",
			text,
			images,
		},
		tsOffset,
	)
}

export const createUserFeedbackDiffMessage = (
	options: {
		diff?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const {
		diff = `--- a/src/components/Example.tsx\n+++ b/src/components/Example.tsx\n@@ -1,3 +1,4 @@\n import React from 'react'\n+\n+// User requested change`,
		tsOffset = 1000,
	} = options

	return createMessage(
		{
			type: "say",
			say: "user_feedback_diff",
			text: JSON.stringify({ diff }),
		},
		tsOffset,
	)
}

export const createCommandOutputSayMessage = (
	options: {
		output?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { output = "File created successfully: src/components/NewComponent.tsx", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "command_output",
			text: output,
		},
		tsOffset,
	)
}

export const createShellIntegrationWarningMessage = (
	options: {
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "shell_integration_warning",
			text: "Shell integration may not work properly in this environment",
		},
		tsOffset,
	)
}

export const createBrowserActionMessage = (
	options: {
		action?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { action = "click", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "browser_action",
			text: JSON.stringify({ action, target: "button#submit" }),
		},
		tsOffset,
	)
}

export const createBrowserActionResultMessage = (
	options: {
		result?: string
		partial?: boolean
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { result = "Button click successful - form submitted correctly", partial = false, tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "browser_action_result",
			text: result,
			partial,
		},
		tsOffset,
	)
}

export const createMcpServerRequestStartedMessage = (
	options: {
		serverName?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { serverName = "filesystem", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "mcp_server_request_started",
			text: JSON.stringify({ serverName }),
		},
		tsOffset,
	)
}

export const createMcpServerResponseMessage = (
	options: {
		response?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { response = "MCP server returned user data successfully", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "mcp_server_response",
			text: response,
		},
		tsOffset,
	)
}

export const createSubtaskResultMessage = (
	options: {
		result?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { result = "Subtask completed successfully", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "subtask_result",
			text: result,
		},
		tsOffset,
	)
}

export const createCheckpointSavedMessage = (
	options: {
		hash?: string
		suppressMessage?: boolean
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { hash = "abc123def456", suppressMessage = false, tsOffset = 1000 } = options

	const checkpoint: any = { hash }
	if (suppressMessage) checkpoint.suppressMessage = true

	return createMessage(
		{
			type: "say",
			say: "checkpoint_saved",
			text: hash,
			checkpoint,
		},
		tsOffset,
	)
}

export const createCondenseContextMessage = (
	options: {
		partial?: boolean
		contextCondense?: any
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { partial = false, contextCondense, tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "condense_context",
			text: "Condensing conversation to save context space",
			partial,
			contextCondense,
		},
		tsOffset,
	)
}

export const createCondenseContextErrorMessage = (
	options: {
		error?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { error = "Failed to condense context: insufficient memory", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "condense_context_error",
			text: error,
		},
		tsOffset,
	)
}

export const createCodebaseSearchResultMessage = (
	options: {
		query?: string
		results?: Array<{
			filePath: string
			score: number
			startLine: number
			endLine: number
			codeChunk: string
		}>
		tsOffset?: number
	} = {},
): ClineMessage => {
	const {
		query = "user authentication",
		results = [
			{
				filePath: "src/auth/login.ts",
				score: 0.95,
				startLine: 10,
				endLine: 25,
				codeChunk: "export const login = async (username: string, password: string) => { ... }",
			},
		],
		tsOffset = 1000,
	} = options

	return createMessage(
		{
			type: "say",
			say: "codebase_search_result",
			text: JSON.stringify({
				content: {
					query,
					results,
				},
			}),
		},
		tsOffset,
	)
}

export const createUserEditTodosMessage = (
	options: {
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "user_edit_todos",
			text: JSON.stringify({
				todos: [
					{ id: "1", text: "Create component", completed: true },
					{ id: "2", text: "Add tests", completed: false },
				],
			}),
		},
		tsOffset,
	)
}

export const createImageMessage = (
	options: {
		imageUri?: string
		imagePath?: string
		tsOffset?: number
	} = {},
): ClineMessage => {
	const { imageUri = "file:///path/to/image.png", imagePath = "/path/to/image.png", tsOffset = 1000 } = options

	return createMessage(
		{
			type: "say",
			say: "image",
			text: JSON.stringify({ imageUri, imagePath }),
		},
		tsOffset,
	)
}
