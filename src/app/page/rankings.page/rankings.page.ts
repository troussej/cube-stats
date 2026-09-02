import { Component, computed, inject, model } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PlayersStoreService } from '../../service/players.service';
import _ from 'lodash';
import { Debug } from '../../component/debug/debug';
import { DraftsStoreService } from '../../service/drafts.service';
import { DatePipe } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DraftResult } from "app/component/draft-result/draft-result";

@Component({
  imports: [PanelModule, DividerModule, TableModule, Debug, DatePipe, SelectModule, FormsModule, DraftResult],
  selector: 'app-rankings-page',
  styleUrl: './rankings.page.css',
  templateUrl: './rankings.page.html',
})
export class RankingsPage {
  public playersService = inject(PlayersStoreService);
  public draftsStoreService = inject(DraftsStoreService);



  public draftOptions = computed(() => {
    return _.chain(this.draftsStoreService.drafts())
      .orderBy(['date'], ['desc'])
      .map((draft) => ({
        label: draft.id,
        value: draft.id,
      })).value();
  });

  public selectedDraft = model(computed(() => this.draftOptions()[0]?.value)());

  public getSelectedDraft = computed(() => {
    const draftId = this.selectedDraft();
    if (!draftId) {
      return null;
    }
    return this.draftsStoreService.drafts().find((draft) => draft.id === draftId) || null;
  });

  public data = computed(() => {
    return _.chain(this.playersService.players())
      .map((player) => {
        const elo = this.playersService.getLatestElo(player);
        return { name: player, elo: elo?.elo, date: elo?.date };
      })
      .value();
  })
}
