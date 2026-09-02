import { inject, Service, signal, WritableSignal } from "@angular/core";
import { Player, PlayerElo } from "../model/model";
import _ from "lodash";
import { ConfigService } from "./config.service";

@Service()
export class PlayersStoreService {

    public config = inject(ConfigService).config;

    public players: WritableSignal<Player[]> = signal<[]>([]);
    public playersElo: WritableSignal<PlayerElo[]> = signal<[]>([]);

    public addPlayer(player: Player) {
        this.players.update(players => [...players, player]);
        return player;
    }

    public addPlayerElo(playerElo: PlayerElo) {
        this.playersElo.update(playersElo => [...playersElo, playerElo]);
    }

    public getLatestElo(player: Player): PlayerElo | null {
        return _.chain(this.playersElo())
            .filter(pe => pe.player.name === player.name)
            .sortBy(pe => pe.date)
            .last()
            .value();
    }

    public calculateElo(player1: Player, player2: Player, score1: number, score2: number, date: Date): [number, number] {
        console.log(`Calculating Elo for ${player1.name} vs ${player2.name} with scores ${score1}-${score2} on ${date.toISOString()}`);
        const K = this.config.kfactor; // K-factor for Elo calculation
        const player1Elo = this.getLatestElo(player1)?.elo ?? this.config.defaultElo;
        const player2Elo = this.getLatestElo(player2)?.elo ?? this.config.defaultElo;

        // Simplified Elo calculation (replace with actual Elo formula if needed)
        const expectedScore1 = 1 / (1 + Math.pow(10, (player2Elo - player1Elo) / 400));
        const expectedScore2 = 1 / (1 + Math.pow(10, (player1Elo - player2Elo) / 400));

        const newElo1 = player1Elo + K * (score1 - expectedScore1);
        const newElo2 = player2Elo + K * (score2 - expectedScore2);

        console.log(`New Elo for ${player1.name}: ${newElo1}, New Elo for ${player2.name}: ${newElo2}`);

        this.addPlayerElo(new PlayerElo(player1, newElo1, date));
        this.addPlayerElo(new PlayerElo(player2, newElo2, date));

        return [newElo1, newElo2];
    }
}