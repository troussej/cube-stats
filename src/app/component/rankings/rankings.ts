import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PlayersStoreService } from 'app/service/players.service';
import _ from 'lodash';
import { TreeNode } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { SortableColumn, TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { Debug } from "../debug/debug";
import { FieldsetModule } from 'primeng/fieldset';
import { EloChange } from "../elo-change/elo-change";
import { RankingChart } from '../chart/ranking-chart/ranking-chart';
import { DraftsStoreService } from 'app/service/drafts.service';
import { Game } from 'app/model/model';

@Component({
  imports: [PanelModule, TableModule, DividerModule, DatePipe, SortableColumn, TreeTableModule, FieldsetModule, EloChange, RankingChart],
  selector: 'app-rankings',
  styleUrl: './rankings.css',
  templateUrl: './rankings.html',
})
export class Rankings {
  public playersService = inject(PlayersStoreService);
  public draftsService = inject(DraftsStoreService);

  public data = computed(() => {
    return _.chain(this.playersService.players())
      .map((player) => {
        const elo = this.playersService.getLatestElo(player);
        return { name: player, elo: elo?.elo, date: elo?.game.date };
      })
      .value();
  })

  public nodes = computed<TreeNode[]>(() => {

    const games = this.draftsService.games();

    return _.chain(this.playersService.players())
      .map((player) => {
        const elo = this.playersService.getLatestElo(player);
        const children = _.chain(this.playersService.playersElo())
          .filter((playerElo) => playerElo.player === player)
          .map((playerElo) => ({
            data: { elo: playerElo, date: playerElo.game.date, round: playerElo.game.round },
          }))
          .orderBy(['data.date', 'data.round'], ['desc', 'desc'])
          .value();
        return {
          data: {
            key: player,
            name: player,
            eloValue: elo?.elo,
            date: elo?.game.date,

          },
          children
        };
      })
      .orderBy('data.eloValue', 'desc')
      .value();
  });

  public findGame(games: Game[], draftId: string, round: number) {
    return games.find(g => g.draftId === draftId && g.round === round);
  }

}
