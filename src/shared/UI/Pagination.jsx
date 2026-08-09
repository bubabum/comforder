import { getVisiblePages } from "../utils/getVisiblePages";

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}) {
	if (totalPages <= 1) return null;

	const pages = getVisiblePages(
		currentPage,
		totalPages
	);

	return (
		<div className="flex items-center justify-center mt-4 relative">
			<span className="text-xs text-text-muted absolute left-0">
				Сторінка {currentPage} з {totalPages}
			</span>

			<div className="flex items-center gap-1">
				<button
					onClick={() => onPageChange(Number(currentPage) - 1)}
					disabled={currentPage === 1}
					className="h-8 w-8 rounded-lg border border-border bg-surface text-text-secondary hover:bg-hover disabled:opacity-50 cursor-pointer"
				>
					‹
				</button>

				{pages.map((page, index) =>
					page === "..." ? (
						<span
							key={`dots-${index}`}
							className="px-2 text-text-muted"
						>
							...
						</span>
					) : (
						<button
							key={`page-${page}`}
							onClick={() => onPageChange(Number(page))}
							className={
								page === currentPage
									? "h-8 w-8 rounded-lg border border-primary bg-primary/5 text-primary text-sm font-medium cursor-pointer"
									: "h-8 w-8 rounded-lg border border-border bg-surface text-text-secondary text-sm hover:bg-hover transition-colors cursor-pointer"
							}
						>
							{page}
						</button>
					)
				)}

				<button
					onClick={() => onPageChange(Number(currentPage) + 1)}
					disabled={
						currentPage === totalPages
					}
					className="h-8 w-8 rounded-lg border border-border bg-surface text-text-secondary hover:bg-hover disabled:opacity-50 cursor-pointer"
				>
					›
				</button>
			</div>
		</div>
	);
}