import { useLocalStorage } from './useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants/localStorageKeys';

export function useSettings() {
	const [inheritLastTrimMaterial, setInheritLastTrimMaterial] = useLocalStorage(
		LOCAL_STORAGE_KEYS.SETTINGS.INHERIT_LAST_TRIM_MATERIAL,
		false,
	);

	const [printFormFontSize, setPrintFormFontSize] = useLocalStorage(
		LOCAL_STORAGE_KEYS.SETTINGS.PRINT_FORM_FONT_SIZE,
		12,
	);

	return {
		inheritLastTrimMaterial,
		setInheritLastTrimMaterial,
		printFormFontSize,
		setPrintFormFontSize,
	};
}