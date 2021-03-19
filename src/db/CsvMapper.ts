import { ITransformer } from "@/core/ITransformer";
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
    defaultConfig = 
    {
        quotes: false, //or array of booleans
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ";",
        header: true,
        newline: "\r\n",
        skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
        columns: null //or array of strings
    };

    transform(objects: TimeLineBase[]): void {   
        const destFieldNameToMatch = this.csvConfig.destFieldNameToMatch;
        const csvFieldNameToMatch = this.csvConfig.csvFieldNameToMatch;
        const destFieldNameToSet = this.csvConfig.destFieldNameToSet;
        const csvFieldNameToRetrieve = this.csvConfig.csvFieldNameToRetrieve;

        var result = parse<any>(this.content,this.defaultConfig);
        for (let i = 0; i < objects.length; i++) {
            const element=objects[i];
            try {
            let matchInElement:string;
            switch (destFieldNameToMatch) {
                case "displayCaption":{
                    matchInElement = element.displayCaption;
                    break;}
                case "id":{
                    matchInElement = element.id;
                    break;}
                default:{
                    const parameter = element.getParameterByName(destFieldNameToMatch);
                    if (parameter == undefined) throw new Error("transform: Could not map to field name: "+destFieldNameToMatch);
                    matchInElement = parameter.asString();
                }
            }

            const query = result.data.find(item => item[csvFieldNameToMatch] == matchInElement);
            if (query != undefined){
                const parameter = element.getParameterByName(destFieldNameToSet);
                parameter.set(query[csvFieldNameToRetrieve]);
            }

        }catch(Error){
            console.log(Error);
        }

        }
        console.log(result.data);
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
    csvFieldNameToRetrieve:string;
}