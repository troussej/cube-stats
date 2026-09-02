import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Service } from "@angular/core";
import { forkJoin, map, Observable, of } from "rxjs";
import * as Papa from 'papaparse';

import * as _ from 'lodash';
import { ConfigService } from "./config.service";
import { LocationStrategy } from "@angular/common";
import { DraftPlayer, DraftSession, Game, PlayerElo } from "app/model/model";

@Service()
export class SheetService {

    private http: HttpClient = inject(HttpClient);
    private config = inject(ConfigService).config;



    public getDraftsSessions(): Observable<DraftSession[]> {
        const url = this.config.data.drafts;
        console.log('getDraftsSessions %s %s', url);
        return this.http.get(url, { responseType: "text" })
            .pipe(
                map(this.parse)
                ,
                map(csv => _.map(csv, (line: any) =>
                ({
                    id: line["Date"],
                    date: this.parseDate(line["Date"]),
                    players: this.parsePlayers(line),
                    games: []
                })
                )),
                map(drafts => { console.log('getDraftsSessions done', drafts); return drafts; })

            );
    }

    private parsePlayers(line: any): DraftPlayer[] {
        let players: DraftPlayer[] = [];
        for (let i = 1; i <= 10; i++) {
            let playerName = line[`J${i}`];
            let playerDeck = line[`Deck J${i}`];
            if (playerName && playerDeck) {
                players.push(new DraftPlayer(playerName, playerDeck));
            }
        }
        return players;
    }

    public getGames(): Observable<Game[]> {
        const url = this.config.data.games;
        console.log('getGames %s %s', url);
        return this.http.get(url, { responseType: "text" })
            .pipe(
                map(this.parse)
                ,
                map(csv => _.map(csv, (line: any) =>
                ({
                    draftId: line["Date"],
                    date: this.parseDate(line["Date"]),
                    round: Number.parseInt(line["Ronde"]),
                    player1: line["J1"],
                    player2: line["J2"],
                    score1: Number.parseInt(line["Score J1"]),
                    score2: Number.parseInt(line["Score J2"]),
                })
                ),
                    map(games => { console.log('getGames done', games); return games; })
                )
            );
    }

    public getPlayerElo(): Observable<PlayerElo[]> {
        const url = this.config.data.players;
        console.log('getPlayerElo %s %s', url);
        return this.http.get(url, { responseType: "text" })
            .pipe(
                map(this.parse)
                ,
                map(csv => _.map(csv, (line: any) =>
                ({
                    date: this.parseDate(line["Date"]),
                    player: line["Nom du joueur"],
                    elo: Number.parseInt(line["Elo"]),
                    round: Number.parseInt(line["Ronde"])
                })
                )),
                map(playerElos => { console.log('getPlayerElo done', playerElos); return playerElos; })
            );
    }

    private parse(text: string) {
        let data = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
        }).data;

        console.log('parse done', data);
        return data;
    }

    private parseDate(dateString: string): Date {
        let dateElems = dateString.split('/');
        return new Date(Number.parseInt(dateElems[2]),
            Number.parseInt(dateElems[1]) - 1,
            Number.parseInt(dateElems[0]))
    }
}


