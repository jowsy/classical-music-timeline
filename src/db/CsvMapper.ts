import { ParameterType } from "@/core";
import { ITransformer } from "@/core/ITransformer";
import { Person } from "@/core/Person";
import { TimeLineBase } from "@/core/TimeLineBase";
import { parse, ParseResult } from "papaparse";

export class CsvMapper implements ITransformer{
    private content:string;
    private csvConfig:CsvMapperConfig;

    constructor(csvContent:string, configuration:CsvMapperConfig){
        this.content = csvContent;
        this.csvConfig = configuration;
        this.defaultConfig.delimiter = configuration.delimiterString;
    }

    //Directly from example code for papaparse
    defaultConfig = 
    {
        delimiter: "",
        header: true
    };

    transform(objects: TimeLineBase[]): void {   

        // csv <=> object
        const destFieldNameToMatch = this.csvConfig.destFieldNameToMatch;
        const csvFieldNameToMatch = this.csvConfig.csvFieldNameToMatch;

        // csv => object value field
        const destFieldNameToSet = this.csvConfig.destFieldNameToSet;
        const csvFieldNameToRetrieve = this.csvConfig.csvFieldNameToRetrieve;

        var result = parse<any>(this.content,this.defaultConfig);
        
        for (let i = 0; i < objects.length; i++) {
            const element=objects[i];
            try {
            let matchInElement:string;
            switch (destFieldNameToMatch) {
                case "fullName":{
                    matchInElement = (element as Person).fullName;
                    break;}
                case "id":{
                    matchInElement = element.internalId.toString();
                    break;}
                default:{
                    const parameter = element.getParameterByName(destFieldNameToMatch);
                    if (parameter == undefined) throw new Error("transform: Could not map to field name: "+destFieldNameToMatch);
                    matchInElement = parameter.asString();
                }
            }

            const query = (result.data as any[]).find(item => item[csvFieldNameToMatch] == matchInElement);
            if (query != undefined){
                const parameter = element.getParameterByName(destFieldNameToSet);
                const value = query[csvFieldNameToRetrieve];
                if (value!=undefined)
                {
                    switch (this.csvConfig.destFieldNameToSetType){
                        case ParameterType.String:
                            {
                                parameter.set(value);   
                                break;
                            }
                        case ParameterType.Number: 
                            {
                                parameter.set(parseInt(value));
                                break;
                            }
                    }
                }
                
            }

        }catch(Error){
            console.log(Error);
        }

        }
    }

    getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
        return o[propertyName]; // o[propertyName] is of type T[K]
    }
}

export class CsvMapperConfig {
    delimiterString:string;

    destFieldNameToMatch:string;
    csvFieldNameToMatch:string;
    destFieldNameToSet:string;
    destFieldNameToSetType:ParameterType;
    csvFieldNameToRetrieve:string;
}