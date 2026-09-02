import { Component, computed, inject } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PlayersStoreService } from '../../service/players.service';
import _ from 'lodash';
import { Debug } from '../../component/debug/debug';
import { DraftsStoreService } from '../../service/drafts.service';

@Component({
  imports: [PanelModule, DividerModule, TableModule, Debug],
  selector: 'app-rankings-page',
  styleUrl: './rankings.page.css',
  templateUrl: './rankings.page.html',
})
export class RankingsPage {
  public playersService = inject(PlayersStoreService);
  public draftsStoreService = inject(DraftsStoreService);

  public data = computed(() => {
    return _.chain(this.playersService.players())
      .map(player => {
        return [player.name, this.playersService.getLatestElo(player)?.elo ?? 0];
      })
      .value();
  })
}
