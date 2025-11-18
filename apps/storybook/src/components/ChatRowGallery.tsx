import React from "react"
import ChatRow from "../../../../webview-ui/src/components/chat/ChatRow"
import type { StoryObj } from "@storybook/react-vite"
import type { Meta } from "@storybook/react-vite"
import type { ComponentProps } from "react"

interface ChatRowGalleryProps {
	stories: Array<{
		name: string
		story: StoryObj<typeof ChatRow>
		meta: Meta<typeof ChatRow>
	}>
}

export const ChatRowGallery: React.FC<ChatRowGalleryProps> = ({ stories }) => {
	// Group stories by type (part before the "/")
	const groupedStories = stories.reduce(
		(acc, { name, story, meta }) => {
			const [type, ...variationParts] = name.split("/")
			const variation = variationParts.join("/") || "Default"
			if (!acc[type]) {
				acc[type] = []
			}
			acc[type].push({ name, variation, story, meta })
			return acc
		},
		{} as Record<
			string,
			Array<{ name: string; variation: string; story: StoryObj<typeof ChatRow>; meta: Meta<typeof ChatRow> }>
		>,
	)

	return (
		<div className="p-5 min-h-screen w-full" style={{ backgroundColor: "var(--vscode-editor-background)" }}>
			<div className="flex flex-col gap-6">
				{Object.entries(groupedStories).map(([type, variations]) => (
					<div key={type} className="flex flex-col gap-2">
						<h3 className="text-sm font-semibold px-2" style={{ color: "var(--vscode-foreground)" }}>
							{type}
						</h3>
						<div className="flex flex-wrap gap-4 items-start">
							{variations.map(({ name, variation, story, meta }, index) => {
								const mergedArgs = { ...meta.args, ...story.args } as ComponentProps<typeof ChatRow>
								if (!mergedArgs.message) return null
								return (
									<div
										key={name}
										className="flex flex-col border rounded overflow-hidden w-[400px] shrink-0"
										style={{
											borderColor: "var(--vscode-panel-border)",
											backgroundColor:
												index % 2 === 0
													? "var(--vscode-editor-background)"
													: "var(--vscode-panel-background)",
										}}>
										<div
											className="px-3 py-2 border-b"
											style={{
												borderBottomColor: "var(--vscode-panel-border)",
												backgroundColor: "var(--vscode-panel-background)",
											}}>
											<span
												className="text-[11px] font-medium font-mono"
												style={{ color: "var(--vscode-foreground)" }}>
												{variation}
											</span>
										</div>
										<div className="p-3 w-full box-border">
											<ChatRow {...mergedArgs} />
										</div>
									</div>
								)
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
