import { IDataGateway } from "./IDataGateway";

/**
 * A collection of data from a specific source, eg. OpenOpus
 */
export class DataSet {
    
    id:number;
    name: string;
    description: string;

    /**
     * IO-operations for retrieving data
     */
    dataGateway:IDataGateway;

}