import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function getOrdinalSuffix(day: number) {
	const suffix =
		day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
				? "nd"
				: day % 10 === 3 && day !== 13
					? "rd"
					: "th";

	return suffix;
}

export function formatDate(dateString: string) {
	const date = new Date(dateString);
	const month = date.toLocaleString("en-US", { month: "short", timeZone: "America/Los_Angeles" });
	const day = date.getDate();
	const year = date.getFullYear();

	const hours = date.toLocaleString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
		timeZone: "America/Los_Angeles",
	});

	const suffix = getOrdinalSuffix(day);

	return `${month} ${day}${suffix} ${year} @ ${hours}`;
}

export function formDataCast<T extends object>(obj: T): FormData {
	const formData = new FormData();

	for (const [k, v] of Object.entries(obj)) {
		if (v != null) {
			formData.set(k, String(v));
		}
	}

	return formData;
}
