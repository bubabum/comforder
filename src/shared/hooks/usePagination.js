import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function usePagination({
	data,
	pageSize = 12,
	syncWithUrl = false,
}) {
	const [searchParams, setSearchParams] = useSearchParams();

	const getInitialPage = () => {
		if (!syncWithUrl) return 1;

		const page = Number(searchParams.get("page"));
		return page > 0 ? page : 1;
	};

	const [page, setPage] = useState(getInitialPage);

	const totalPages = Math.max(
		1,
		Math.ceil(data.length / pageSize)
	);

	// Якщо після пошуку сторінок стало менше
	useEffect(() => {
		if (page > totalPages) {
			setPage(totalPages);
		}
	}, [page, totalPages]);

	// Синхронізація з URL
	useEffect(() => {
		if (!syncWithUrl) return;

		setSearchParams(prev => {
			const next = new URLSearchParams(prev);

			if (page === 1) {
				next.delete("page");
			} else {
				next.set("page", page.toString());
			}

			return next;
		});
	}, [page, syncWithUrl, setSearchParams]);

	const pageData = useMemo(() => {
		const start = (page - 1) * pageSize;

		return data.slice(
			start,
			start + pageSize
		);
	}, [data, page, pageSize]);

	return {
		page,
		pageData,
		totalPages,
		setPage,
	};
}