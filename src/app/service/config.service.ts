import { Service } from "@angular/core";

@Service()
export class ConfigService {


    get config() {
        return {
            defaultElo: 1000,
            kfactor: 32
        };
    }
}