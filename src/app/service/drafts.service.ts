import { Service, WritableSignal, inject, signal } from "@angular/core";
import { DraftPlayer, DraftSession } from "../model/model";
import { PlayersStoreService } from "./players.service";
import _ from "lodash";

@Service()
export class DraftsStoreService {

    public playerService = inject(PlayersStoreService);

    public drafts: WritableSignal<DraftSession[]> = signal<[]>([]);
    public currentDraftSession: WritableSignal<DraftSession | null> = signal<DraftSession | null>(null);

    public createDraftSession(date: Date, players: DraftPlayer[]) {
        const draftSession: DraftSession = { date, players, games: [] };
        this.drafts.update(drafts => [...drafts, draftSession]);
        this.currentDraftSession.set(draftSession);
        return draftSession;
    }

    public addGame(draftSession: DraftSession,
        roundNumber: number,
        player1: DraftPlayer,
        player2: DraftPlayer,
        score1: number, score2: number) {
        const game = { round: roundNumber, player1, player2, score1, score2, date: draftSession.date };
        draftSession.games.push(game);
        this.drafts.update(drafts => drafts.map(ds => ds.date === draftSession.date ? draftSession : ds));
    }

    public finishDraftSession(draftSession: DraftSession) {
        console.log(`Finishing draft session on ${draftSession.date.toISOString()}`);
        // Calculate Elo for each game in the draft session
        _.chain(draftSession.games)
            .sort((game) => game.round)
            .forEach(game => {
                console.log(`Processing game: ${game.player1.name} vs ${game.player2.name}, score: ${game.score1}-${game.score2}`);
                const player1 = { name: game.player1.name };
                const player2 = { name: game.player2.name };
                this.playerService.calculateElo(player1, player2, game.score1, game.score2, draftSession.date);
            })
            .value();
    }

}