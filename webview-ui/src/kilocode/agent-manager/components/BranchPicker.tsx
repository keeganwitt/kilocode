import { useState, useMemo, useRef, useEffect } from "react"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"
import { Search, GitBranch } from "lucide-react"
import { branchesAtom, currentBranchAtom } from "../state/atoms/branches"

interface BranchPickerProps {
	selectedBranch: string | null
	onSelect: (branch: string) => void
	onClose: () => void
}

/**
 * Branch picker component showing searchable list of local branches
 * with "Your branches" (current) and "Other branches" sections
 */
export function BranchPicker({ selectedBranch, onSelect, onClose }: BranchPickerProps) {
	const { t } = useTranslation("agentManager")
	const branches = useAtomValue(branchesAtom)
	const currentBranch = useAtomValue(currentBranchAtom)

	const [searchTerm, setSearchTerm] = useState("")
	const searchInputRef = useRef<HTMLInputElement>(null)

	// Focus search input on mount
	useEffect(() => {
		searchInputRef.current?.focus()
	}, [])

	// Categorize and filter branches
	const { yourBranches, otherBranches } = useMemo(() => {
		const filtered = branches.filter((b) => b.toLowerCase().includes(searchTerm.toLowerCase()))

		const your = currentBranch && filtered.includes(currentBranch) ? [currentBranch] : []
		const other = filtered.filter((b) => b !== currentBranch)

		return {
			yourBranches: your,
			otherBranches: other,
		}
	}, [branches, currentBranch, searchTerm])

	const hasResults = yourBranches.length > 0 || otherBranches.length > 0

	const handleSelect = (branch: string) => {
		onSelect(branch)
		onClose()
	}

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50"
			onClick={handleBackdropClick}>
			<div className="bg-vscode-editor-background border border-vscode-editorWidget-border rounded-md shadow-lg w-96 max-h-96 flex flex-col overflow-hidden">
				{/* Search Input */}
				<div className="p-3 border-b border-vscode-editorWidget-border">
					<div className="flex items-center gap-2 px-3 py-2 bg-vscode-input-background border border-vscode-input-border rounded">
						<Search size={14} className="text-vscode-input-foreground flex-shrink-0" />
						<input
							ref={searchInputRef}
							type="text"
							placeholder={t("sessionDetail.searchBranches")}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="bg-transparent text-vscode-input-foreground placeholder-vscode-inputPlaceholder-foreground flex-1 outline-none text-sm"
						/>
					</div>
				</div>

				{/* Branches List */}
				<div className="flex-1 overflow-y-auto">
					{!hasResults && branches.length === 0 ? (
						<div className="p-4 text-center text-vscode-descriptionForeground text-sm">
							{t("sessionDetail.noBranches")}
						</div>
					) : !hasResults && searchTerm ? (
						<div className="p-4 text-center text-vscode-descriptionForeground text-sm">
							{t("sessionDetail.noMatchingBranches")}
						</div>
					) : (
						<div>
							{/* Your Branches Section */}
							{yourBranches.length > 0 && (
								<div>
									<div className="px-3 py-2 text-xs font-semibold text-vscode-descriptionForeground uppercase tracking-wide">
										{t("sessionDetail.yourBranches")}
									</div>
									{yourBranches.map((branch) => (
										<button
											key={branch}
											onClick={() => handleSelect(branch)}
											className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-vscode-list-hoverBackground transition-colors ${
												selectedBranch === branch
													? "bg-vscode-list-activeSelectionBackground text-vscode-list-activeSelectionForeground"
													: "text-vscode-list-foreground"
											}`}>
											<GitBranch size={12} className="flex-shrink-0" />
											<span className="truncate">{branch}</span>
											{selectedBranch === branch && <span className="ml-auto">✓</span>}
										</button>
									))}
								</div>
							)}

							{/* Other Branches Section */}
							{otherBranches.length > 0 && (
								<div>
									{yourBranches.length > 0 && (
										<div className="h-px bg-vscode-editorWidget-border mx-2" />
									)}
									<div className="px-3 py-2 text-xs font-semibold text-vscode-descriptionForeground uppercase tracking-wide">
										{t("sessionDetail.otherBranches")}
									</div>
									{otherBranches.map((branch) => (
										<button
											key={branch}
											onClick={() => handleSelect(branch)}
											className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-vscode-list-hoverBackground transition-colors ${
												selectedBranch === branch
													? "bg-vscode-list-activeSelectionBackground text-vscode-list-activeSelectionForeground"
													: "text-vscode-list-foreground"
											}`}>
											<GitBranch size={12} className="flex-shrink-0" />
											<span className="truncate">{branch}</span>
											{selectedBranch === branch && <span className="ml-auto">✓</span>}
										</button>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
