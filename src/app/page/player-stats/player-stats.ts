import { Component, computed, inject, model } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../service/players.service';
import { DraftsStoreService } from '../../service/drafts.service';
import { Panel, PanelModule } from "primeng/panel";
import { PlayerEloChart } from "app/component/chart/player-elo-chart/player-elo-chart";
import { SortableColumn, TableModule } from 'primeng/table';
import _ from 'lodash';
import { DeckTag } from "app/component/deck-tag/deck-tag";
import { EloChange } from "app/component/elo-change/elo-change";
import { PlayerPicker } from "app/component/player-picker/player-picker";
import { Home } from '@primeicons/angular';

@Component({
  imports: [PanelModule, PlayerEloChart, TableModule, DatePipe, DeckTag, EloChange, SortableColumn, PlayerPicker, ButtonDirective, Home],
  selector: 'app-player-stats',
  styleUrl: './player-stats.css',
  templateUrl: './player-stats.html',
})
export class PlayerStats {

  public name = model<string>('');

  private route = inject(ActivatedRoute);
  public playerService = inject(PlayerService);
  public draftsService = inject(DraftsStoreService);
  public router = inject(Router);

  constructor() {
    this.name.set(this.route.snapshot.paramMap.get('name') ?? '');
  }

  public draftPlayers = computed(() => {
    return _.chain(this.draftsService.drafts())
      .map(draft => ({ players: draft.players, draft }))
      .flatMap(({ players, draft }) => players.map(player => ({ player, draft })))
      .filter((data) => data.player.name === this.name())
      .map(data => ({
        player: data.player,
        draftId: data.draft.id,
        deck: data.player.deck,
        draft: data.draft,
        score: data.player.score
      }))
      .value()
  });

  changePlayer($event?: string) {
    console.log('Changing player to', $event);
    if ($event) {
      this.name.set($event);
      this.router.navigate(['/player', $event]);
    }
  }
}
