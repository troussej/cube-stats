import { Component, computed, input } from '@angular/core';
import { DraftSession } from 'app/model/model';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';


@Component({
  imports: [CardModule, TableModule, DividerModule],
  selector: 'app-round-result',
  styleUrl: './round-result.css',
  templateUrl: './round-result.html',
})
export class RoundResult {

  public draftSession = input.required<DraftSession>();
  public roundNumber = input.required<number>();

  public roundGames = computed(() => {
    if (!this.draftSession() || !this.roundNumber()) {
      return [];
    }
    return this.draftSession().games.filter(game => game.round === this.roundNumber());
  });

}
