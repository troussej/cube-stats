import { Service } from "@angular/core";

@Service()
export class ConfigService {


    get config() {
        return {
            defaultElo: 1200,
            kfactor: 100,
            nbMoisActif: 6,
            data: {
                drafts: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTGX1dGSR79rGFwMxCH2KD94PaHLif8fW-rG5WmOls9nMEm1eSpu6iamFSbTU6z8TPGh51xzmCt1tJ/pub?gid=0&single=true&output=csv",
                games: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTGX1dGSR79rGFwMxCH2KD94PaHLif8fW-rG5WmOls9nMEm1eSpu6iamFSbTU6z8TPGh51xzmCt1tJ/pub?gid=1483125036&single=true&output=csv",
                players: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTGX1dGSR79rGFwMxCH2KD94PaHLif8fW-rG5WmOls9nMEm1eSpu6iamFSbTU6z8TPGh51xzmCt1tJ/pub?gid=1485550174&single=true&output=csv"
            },
            colors: {
                W: '#ffdf20',
                U: '#53eafd',
                B: '#c4b4ff',
                R: '#ffa2a2',
                G: '#7bf1a8'
            },
            colorOrder: {
                "W": "W",
                "U": "U",
                "B": "B",
                "R": "R",
                "G": "G",
                "UW": "WU",
                "BW": "WB",
                "RW": "RW",
                "GW": "GW",
                "BU": "UB",
                "RU": "UR",
                "GU": "UG",
                "BR": "BR",
                "BG": "BG",
                "GR": "RG",
                "BUW": "WUB",
                "RUW": "URW",
                "GUW": "GWU",
                "BRW": "RWB",
                "BGW": "WBG",
                "GRW": "RGW",
                "BRU": "UBR",
                "BGU": "BGU",
                "GRU": "GUR",
                "BGR": "UBR",
                "BRUW": "WUBR",
                "BGUW": "GWUB",
                "GRUW": "RGWU",
                "BGRW": "BRGW",
                "BGRU": "UBRG",
                "BGRUW": "WUBRG"
            }
        };
    }
}