import { Composer } from "./openopusapi";
export default class Utils {
    static getTextColorByBackgroundColor(hex: string): string;
    static compareDate(emp1: Composer, emp2: Composer): 1 | -1;
}
declare global {
    interface Array<T> {
        groupBy<T, K extends keyof any>(this: T[], getKey: (item: T) => K): Record<K, T[]>;
    }
}
