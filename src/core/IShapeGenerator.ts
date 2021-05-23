import { Person } from ".";

export interface IShapeGenerator {
    generatePersonShapes(persons:Person[]):void;
}