import { Service } from "@angular/core";

@Service()
export class ConfigService {


    get config() {
        return {
            defaultElo: 1200,
            kfactor: 100,
            data: {
                drafts: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTGX1dGSR79rGFwMxCH2KD94PaHLif8fW-rG5WmOls9nMEm1eSpu6iamFSbTU6z8TPGh51xzmCt1tJ/pub?gid=0&single=true&output=csv",
                games: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTGX1dGSR79rGFwMxCH2KD94PaHLif8fW-rG5WmOls9nMEm1eSpu6iamFSbTU6z8TPGh51xzmCt1tJ/pub?gid=1483125036&single=true&output=csv",
                players: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTGX1dGSR79rGFwMxCH2KD94PaHLif8fW-rG5WmOls9nMEm1eSpu6iamFSbTU6z8TPGh51xzmCt1tJ/pub?gid=1485550174&single=true&output=csv"
            }
        };
    }
}