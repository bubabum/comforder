import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadReferenceData } from "../store/referenceData/referenceDataThunks";

export function AppInit() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadReferenceData());
	}, [dispatch]);

	return null;
}