import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { intl } from "src/locale";

let lastShown = 0;

export const useStaticBackdropHint = (visible: boolean, remove: () => void) => {
	const dirtyRef = useRef(false);

	useEffect(() => {
		if (!visible) return;
		const handler = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target?.classList?.contains("modal")) return;
			if (!dirtyRef.current) {
				remove();
				return;
			}
			const now = Date.now();
			if (now - lastShown < 2000) return;
			lastShown = now;
			toast.info(intl.formatMessage({ id: "modal.use-close-button" }));
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [visible, remove]);

	return dirtyRef;
};

export const DirtyTracker = ({ dirtyRef }: { dirtyRef: React.MutableRefObject<boolean> }) => {
	const { dirty } = useFormikContext();
	useEffect(() => {
		dirtyRef.current = dirty;
	}, [dirty, dirtyRef]);
	return null;
};
