import { inject, Service, signal, WritableSignal } from "@angular/core";
import { PlayerElo } from "../model/model";
import _ from "lodash";
import { ConfigService } from "./config.service";

@Service()
export class PlayersStoreService {

    public config = inject(ConfigService).config;

    public players: WritableSignal<string[]> = signal<[]>([]);
    public playersElo: WritableSignal<PlayerElo[]> = signal<[]>([]);

    public addPlayer(player: string) {
        console.log(`Adding player: ${player}`);
        this.players.update(players => _.chain(players).concat(player).uniq().sort().value());
        return player;
    }

    public addPlayerElo(playerElo: PlayerElo) {
        this.playersElo.update(playersElo => [...playersElo, playerElo]);
    }

    public updatePlayerElo(player: string, elo: number, date: Date, round: number): PlayerElo {
        //if date is more recent than the latest elo for the player, add a new PlayerElo entry
        const latestElo = this.getLatestElo(player);
        const playerElo = new PlayerElo(player, elo, latestElo?.elo ?? this.config.defaultElo, date, round);
        if (!latestElo || playerElo.date > latestElo.date || (playerElo.date >= latestElo.date && playerElo.round > latestElo.round)) {
            this.addPlayerElo(playerElo);
        }
        return playerElo;
    }

    public getLatestElo(player: string): PlayerElo | null {
        return _.chain(this.playersElo())
            .filter({ player })
            .sortBy(pe => pe.date)
            .last()
            .value();
    }

    public calculateElo(player1: string, player2: string, score1: number, score2: number, date: Date): [number, number] {
        console.log(`Calculating Elo for ${player1} vs ${player2} with scores ${score1}-${score2} on ${date.toISOString()}`);
        const K = this.config.kfactor; // K-factor for Elo calculation
        const player1Elo = this.getLatestElo(player1)?.elo ?? this.config.defaultElo;
        const player2Elo = this.getLatestElo(player2)?.elo ?? this.config.defaultElo;

        // Simplified Elo calculation (replace with actual Elo formula if needed)
        const expectedScore1 = 1 / (1 + Math.pow(10, (player2Elo - player1Elo) / 400));
        const expectedScore2 = 1 / (1 + Math.pow(10, (player1Elo - player2Elo) / 400));

        let matchScore1 = 0.5; // Default to draw
        let matchScore2 = 0.5; // Default to draw
        if (score1 !== score2) {
            matchScore1 = score1 > score2 ? 1 : 0;
            matchScore2 = score2 > score1 ? 1 : 0;

        }

        const newElo1 = Math.round(player1Elo + K * (matchScore1 - expectedScore1));
        const newElo2 = Math.round(player2Elo + K * (matchScore2 - expectedScore2));

        console.log(`New Elo for ${player1}: ${newElo1}, New Elo for ${player2}: ${newElo2}`);

        return [newElo1, newElo2];
    }
}