import { Service, WritableSignal, inject, signal } from "@angular/core";
import { DraftPlayer, DraftSession } from "../model/model";
import { PlayersStoreService } from "./players.service";
import _ from "lodash";
import { forkJoin, map, Observable } from "rxjs";
import { SheetService } from "./sheet.service";

@Service()
export class DraftsStoreService {

    public playerService = inject(PlayersStoreService);
    public sheetService = inject(SheetService);

    public drafts: WritableSignal<DraftSession[]> = signal<[]>([]);
    public currentDraftSession: WritableSignal<DraftSession | null> = signal<DraftSession | null>(null);


    public init(): Observable<boolean> {

        return forkJoin([
            this.sheetService.getDraftsSessions(),
            this.sheetService.getGames(),
            this.sheetService.getPlayerElo()
        ]).pipe(
            map(([drafts, games, playerElos]) => {

                const gamesByDraftId = _.groupBy(games, 'draftId');
                const draftsById = _.keyBy(drafts, ds => ds.id);

                const players = _.chain(playerElos).map('player').uniq().value();
                for (const playerName of players) {
                    this.playerService.addPlayer(playerName);
                }

                this.playerService.playersElo.set(playerElos);

                _.forEach(gamesByDraftId, (gamesForDraft, draftId) => {
                    const draftSession = draftsById[draftId];
                    if (draftSession) {
                        for (const player of draftSession.players) {
                            this.playerService.addPlayer(player.name);
                        }
                        draftSession.games = gamesForDraft;
                        this.addDraftSession(draftSession);

                    }
                });

                _.chain(games)
                    .orderBy(['date', 'round'], ['asc', 'asc'])
                    .forEach(game => {
                        const [newElo1, newElo2] = this.playerService.calculateElo(game.player1, game.player2, game.score1, game.score2, game.date);

                        const pElo1 = this.playerService.buildPlayerElo(game.player1, newElo1, game.date, game.round);
                        const pElo2 = this.playerService.buildPlayerElo(game.player2, newElo2, game.date, game.round);

                        pElo1.opponent = pElo2;
                        pElo2.opponent = pElo1;

                        this.playerService.updatePlayerElo(pElo1);
                        this.playerService.updatePlayerElo(pElo2);
                    })
                    .value();


                console.log('init done', drafts, games, playerElos);
                return true;
            })
        );
    }


    public createDraftSession(date: Date, players: DraftPlayer[]) {
        const draftSession: DraftSession = { id: date.toISOString(), date, players, games: [] };
        this.drafts.update(drafts => [...drafts, draftSession]);
        this.currentDraftSession.set(draftSession);
        return draftSession;
    }

    public addDraftSession(draftSession: DraftSession) {
        this.drafts.update(drafts => [...drafts, draftSession]);
    }

    public updateDraftSession(draftSession: DraftSession) {
        this.drafts.update(drafts => drafts.map(ds => ds.id === draftSession.id ? draftSession : ds));
    }

    public addGame(draftSession: DraftSession,
        roundNumber: number,
        player1: DraftPlayer,
        player2: DraftPlayer,
        score1: number, score2: number) {
        const game = { round: roundNumber, player1: player1.name, player2: player2.name, score1, score2, date: draftSession.date, draftId: draftSession.id };
        draftSession.games.push(game);
        this.drafts.update(drafts => drafts.map(ds => ds.id === draftSession.id ? draftSession : ds));
    }

    public finishDraftSession(draftSession: DraftSession) {
        console.log(`Finishing draft session on ${draftSession.date.toISOString()}`);
        // Calculate Elo for each game in the draft session
        _.chain(draftSession.games)
            .sort((game) => game.round)
            .forEach(game => {
                console.log(`Processing game: ${game.player1} vs ${game.player2}, score: ${game.score1}-${game.score2}`);
                this.playerService.calculateElo(game.player1, game.player2, game.score1, game.score2, draftSession.date);
            })
            .value();
    }

}