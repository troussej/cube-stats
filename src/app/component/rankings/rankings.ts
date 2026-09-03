import { DatePipe } from '@angular/common';
import { Component, computed, inject, model } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PlayersStoreService } from 'app/service/players.service';
import _ from 'lodash';
import { TreeNode } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { FieldsetModule } from 'primeng/fieldset';
import { EloChange } from "../elo-change/elo-change";
import { DraftsStoreService } from 'app/service/drafts.service';
import { Game, PlayerEloChange } from 'app/model/model';
import { PlayerEloChart } from "../chart/player-elo-chart/player-elo-chart";
import { FormsModule } from '@angular/forms';
import { ConfigService } from 'app/service/config.service';
import moment from 'moment';

@Component({
  imports: [PanelModule, TableModule, DividerModule, DatePipe, TreeTableModule, FieldsetModule, EloChange, PlayerEloChart, ToggleSwitchModule, FormsModule],
  selector: 'app-rankings',
  styleUrl: './rankings.css',
  templateUrl: './rankings.html',
})
export class Rankings {

  public playersService = inject(PlayersStoreService);
  public draftsService = inject(DraftsStoreService);
  public config = inject(ConfigService).config;

  public actif = model<boolean>(true);

  public nodes = computed<TreeNode[]>(() => {

    const games = this.draftsService.games();

    const cutoffDate = moment().add(-1 * this.config.nbMoisActif, 'months');

    return _.chain(this.playersService.players())
      .map(player => ({ player, lastElo: this.playersService.getLatestElo(player) }))
      .filter(data => !this.actif() || moment(data.lastElo?.game.date).isAfter(cutoffDate))
      .map((data) => {
        const elo = data.lastElo;
        const children = _.chain(this.playersService.playersElo())
          .filter((playerElo) => playerElo.player === data.player)
          .map((playerElo) => ({
            data: { elo: playerElo, date: playerElo.game.date, round: playerElo.game.round, oppData: this.oppData(playerElo, games) },
          }))
          .orderBy(['data.date', 'data.round'], ['desc', 'desc'])
          .value();
        return {
          data: {
            key: data.player,
            name: data.player,
            eloValue: elo?.elo,
            date: elo?.game.date,

          },
          children: [{ data: { chart: true, player: data.player } }, ...children]
        };
      })
      .orderBy('data.eloValue', 'desc')
      .value();
  });

  public findGame(games: Game[], draftId: string, round: number, player: string) {
    return games.find(g => g.draftId === draftId && g.round === round && (g.player1 === player || g.player2 === player));
  }

  oppData(playerElo: PlayerEloChange, games: Game[]): any {
    const game = this.findGame(games, playerElo.game.draftId, playerElo.game.round, playerElo.player);
    if (!game) return null;
    return game.player1 === playerElo.player ? game.eloChange2 : game.eloChange1;

  }

}
