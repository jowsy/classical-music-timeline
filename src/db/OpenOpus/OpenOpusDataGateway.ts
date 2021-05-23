import { WorkspaceBase, TimeLineBase, Person, ParameterType } from "@/core";
import { IDataGateway } from "@/core/IDataGateway";
import { CsvMapper, CsvMapperConfig } from "../CsvMapper";
import { OpenOpusJsonMapper } from "./OpenOpusJsonMapper";

export class OpenOpusDataGateway implements IDataGateway {
    Load(session: WorkspaceBase): Promise<Boolean> {

        return new Promise((resolve, reject) => {
            //Define data transformer for CSV file
            //=================================================================
            const imdbDestParameterName = "ImdbSoundtrackCredits";

            const csvMapperConfig = Object.assign({
                destFieldNameToMatch: "fullName",
                csvFieldNameToMatch: "Name",
                destFieldNameToSet: imdbDestParameterName,
                destFieldNameToSetType: ParameterType.Number,
                csvFieldNameToRetrieve: "SoundtrackCredits",
                delimiterString: ";"
            }, new CsvMapperConfig());


            //Create custom parameters
            //=================================================================
            try {
                session.configuration.addParameter(imdbDestParameterName,
                    "IMDB soundtrack credits",
                    ParameterType.Number,
                    true,
                    "Number of soundtrack credits for composer in March 2021."); //for IMDB soundtrack credits, see csv-mapper above
            } catch (Error) {
                console.debug("OpenOpusDataGateway: failed to create parameter: " + Error.message);
                reject(false);
            }
            //Load data source - OpenOpus
            //=================================================================
            fetch("dump.json")
                .then(response => response.text())
                .then(json => {
                    var mapper = new OpenOpusJsonMapper(json);
                    mapper.AddParameters(session);
                    session.elements.push(...mapper.getElements(session));
                    console.debug("JSON fetched, entities mapped and created");
                })
                .finally(() => {
                    fetch("IMDBSoundtrackCredits.csv")
                        .then(response => response.text())
                        .then(csv => {

                            const csvTransformer = new CsvMapper(csv, csvMapperConfig);
                            csvTransformer.transform(session.elements);

                            console.debug("CsvMapper - transform called");

                            /*const parameterDef = this.session.configuration.getParameterByName(imdbDestParameterName);
                
                            //Color in timeline using a gradient
                           if (parameterDef!=undefined)
                              this.session.colorManager.mapColorsByNumberParameter(parameterDef,
                                                                                   10, 
                                                                                    new WebColor("#e5f5f9"), 
                                                                                    new WebColor("#2ca25f"));
                            */

                            resolve(true);
                        })
                        .catch(error => {
                            console.log("ERROR:"+error);
                            reject(false)
                            
                        });
                });
        });
    }

    Select(element: TimeLineBase): void {
        if (element instanceof Person) {
            console.log("selected!! Lazy load!!");
        }
    }


}