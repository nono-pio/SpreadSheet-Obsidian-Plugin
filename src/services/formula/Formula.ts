/*

T = type of return of the function

*/
export default abstract class Formula<T> {
	abstract GetValue(): T;
}
