declare module 'regression' {
	type NumberArray = Array<number>;

	export class Result {
		equation: Array<NumberArray>;
		points: Array<NumberArray>;
		string: string;
	}

	export class Options {
		order?: number;
		precision?: number;
	}

	export const _default: {
		linear: (points: Array<NumberArray>, options?: Options) => Result;
	}

	export default _default;
}
