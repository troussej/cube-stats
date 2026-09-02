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

@Component({
  imports: [PanelModule, TableModule, DividerModule, DatePipe, SortableColumn, TreeTableModule, FieldsetModule],
  selector: 'app-rankings',
  styleUrl: './rankings.css',
  templateUrl: './rankings.html',
})
export class Rankings {
  public playersService = inject(PlayersStoreService);

  public data = computed(() => {
    return _.chain(this.playersService.players())
      .map((player) => {
        const elo = this.playersService.getLatestElo(player);
        return { name: player, elo: elo?.elo, date: elo?.date };
      })
      .value();
  })

  public nodes = computed<TreeNode[]>(() => {


    return _.chain(this.playersService.players())
      .map((player) => {
        const elo = this.playersService.getLatestElo(player);
        const children = _.chain(this.playersService.playersElo())
          .filter((playerElo) => playerElo.player === player)
          .map((playerElo) => ({
            data: { elo: playerElo.elo, date: playerElo.date, round: playerElo.round, ancienElo: playerElo.oldElo },
          }))
          .orderBy(['data.date', 'data.round'], ['desc', 'desc'])
          .value();
        return {
          data: {
            key: player,
            name: player,
            elo: elo?.elo,
            date: elo?.date,

          },
          children
        };
      })
      .orderBy('data.elo', 'desc')
      .value();
  });
}
