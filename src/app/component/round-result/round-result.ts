import { Component, computed, input } from '@angular/core';
import { DraftSession, Game } from 'app/model/model';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';


@Component({
  imports: [PanelModule, TableModule, DividerModule],
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

  public getClasses(p: number, game: Game) {
    if (p == 1) {
      if (game.score1 > game.score2) {
        return 'text-green-300';
      } else if (game.score1 < game.score2) {
        return 'text-red-300'
      }
    }
    if (p == 2) {
      if (game.score1 < game.score2) {
        return 'text-green-300';
      } else if (game.score1 > game.score2) {
        return 'text-red-300'
      }
    }

    return '';
  }

}
