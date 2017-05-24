import {Injectable} from "@angular/core";
import {AppConfig} from "./app.config";
@Injectable()
export class SubtitlesService {

    constructor(
        private config: AppConfig
    ) {  }
}