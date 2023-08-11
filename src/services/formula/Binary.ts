import Formula from "./Formula";

export default class Binary<T, D, E> extends Formula<T> {
	a: Formula<D>;
	b: Formula<E>;
	calculate: (a: D, b: E) => T;

	constructor(calculate: (a: D, b: E) => T, a: Formula<D>, b: Formula<E>) {
		super();
		this.calculate = calculate;
		this.a = a;
		this.b = b;
	}

	GetValue(): T {
		return this.calculate(this.a.GetValue(), this.b.GetValue());
	}
}
