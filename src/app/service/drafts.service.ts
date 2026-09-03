import { Service, WritableSignal, inject, signal } from "@angular/core";
import { DraftPlayer, DraftSession, Game } from "../model/model";
import { PlayersStoreService } from "./players.service";
import _ from "lodash";
import { forkJoin, map, Observable } from "rxjs";
import { SheetService } from "./sheet.service";

@Service()
export class DraftsStoreService {

    public playerService = inject(PlayersStoreService);
    public sheetService = inject(SheetService);

    public drafts: WritableSignal<DraftSession[]> = signal<[]>([]);
    public games: WritableSignal<Game[]> = signal<[]>([]);
    //  public currentDraftSession: WritableSignal<DraftSession | null> = signal<DraftSession | null>(null);


    public init(): Observable<boolean> {

        return forkJoin([
            this.sheetService.getDraftsSessions(),
            this.sheetService.getGames()

        ]).pipe(
            map(([drafts, games]) => {

                const gamesByDraftId = _.groupBy(games, 'draftId');
                const draftsById = _.keyBy(drafts, ds => ds.id);



                _.forEach(gamesByDraftId, (gamesForDraft, draftId) => {
                    const draftSession = draftsById[draftId];
                    if (draftSession) {
                        for (const player of draftSession.players) {
                            this.playerService.addPlayer(player.name);
                        }
                        draftSession.games = gamesForDraft;
                        this.updatePlayerResults(draftSession);


                    }
                });

                _.chain(games)
                    .orderBy(['date', 'round'], ['asc', 'asc'])
                    .forEach(game => {
                        const [newElo1, newElo2] = this.playerService.calculateElo(game.player1, game.player2, game.score1, game.score2, game.date);

                        const ec1 = this.playerService.updatePlayerElo(game.player1, newElo1, game.date, game.round);
                        const ec2 = this.playerService.updatePlayerElo(game.player2, newElo2, game.date, game.round);
                        game.eloChange1 = ec1;
                        game.eloChange2 = ec2;
                    })
                    .value();


                this.drafts.set(_.values(draftsById));
                this.games.set(games);
                console.log('init done', this.drafts(), this.games());
                return true;
            })
        );
    }

    public updatePlayerResults(draftSession: DraftSession) {
        _.chain(draftSession.players)
            .forEach(player => {
                const result = _.reduce(draftSession.games, (counts, game) => {
                    if (game.player1 !== player.name && game.player2 !== player.name) {
                        return counts;
                    }

                    if (game.score1 === game.score2) {
                        counts.draws++;
                    } else if ((game.player1 === player.name && game.score1 > game.score2) || (game.player2 === player.name && game.score2 > game.score1)) {
                        counts.wins++;
                    } else {
                        counts.losses++;
                    }

                    return counts;
                }, { wins: 0, losses: 0, draws: 0 });

                player.wins = result.wins;
                player.losses = result.losses;
                player.draws = result.draws;
                player.score = 3 * result.wins + result.draws;
            })
            .value();
    }

}