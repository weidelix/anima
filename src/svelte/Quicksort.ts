// Quicksort algorithm

export function sort(arr: any[], comparator: (el1: any, el2: any) => boolean): any[] {
	let low = 0;
	let high = arr.length - 1;

	if (low < high) {
		let partIndex = partition(arr, low, high, comparator);

		sortRec(arr, low, partIndex - 1, comparator);
		sortRec(arr, partIndex + 1, high, comparator);
	}

	return arr;
}

function sortRec(arr: any[], low: number, high: number, comparator: (el1: any, el2: any) => boolean) {
	if (low < high) {
		let partIndex = partition(arr, low, high, comparator);

		sortRec(arr, low, partIndex - 1, comparator);
		sortRec(arr, partIndex + 1, high, comparator);
	}
}

function partition(arr: any[], low: number, high: number, comparator: (el1: any, el2: any) => boolean) {
	let pivot = arr[high];

	let i = low - 1;
	for (let j = low; j <= high - 1; j++) {
		if (comparator(arr[j], pivot)) {
			i++;
			// swap
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}
	// swap
	[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
	return i + 1;
}

// Sorting order

export function byNameAtoZ(a: any, b: any) {
	let val = a.name.localeCompare(b.name);

	if (val === -1) return true;
	if (val ===  1) return false;
}

export function byNameZtoA(a: any, b: any) {
	let val = a.name.localeCompare(b.name);

	if (val === -1) return false;
	if (val ===  1) return true;
}

export function byReleaseAsc(a: any, b: any) {
	let da = new Date(a.released);
	let db = new Date(b.released);

	if (da < db) return false;
	if (da > db) return true;
	if (da === db) return true;
}

export function byReleaseDesc(a: any, b: any) {
	let da = new Date(a.released);
	let db = new Date(b.released);

	if (da > db) return false;
	if (da < db) return true;
	if (da === db) return true;
}

export default {
	sort,
	byNameAtoZ,
	byNameZtoA,
	byReleaseAsc,
	byReleaseDesc
};