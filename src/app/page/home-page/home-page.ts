import { DatePipe } from '@angular/common';
import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Debug } from 'app/component/debug/debug';
import { DraftResult } from 'app/component/draft-result/draft-result';
import { Rankings } from 'app/component/rankings/rankings';
import { DraftsStoreService } from 'app/service/drafts.service';
import { PlayerService } from 'app/service/players.service';
import _ from 'lodash';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { RankingChart } from "app/component/chart/ranking-chart/ranking-chart";

@Component({
  imports: [Rankings, PanelModule, DividerModule, TableModule, Debug, DatePipe, SelectModule, FormsModule, DraftResult, FieldsetModule, RankingChart],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {

  public playersService = inject(PlayerService);
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
}
