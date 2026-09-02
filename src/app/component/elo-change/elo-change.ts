import { Component, computed, input } from '@angular/core';
import { PlayerElo } from 'app/model/model';
import { ArrowDownRight, ArrowUpRight, ArrowRight } from '@primeicons/angular';

@Component({
  imports: [ArrowUpRight, ArrowDownRight, ArrowRight],
  selector: 'app-elo-change',
  styleUrl: './elo-change.css',
  templateUrl: './elo-change.html',
})
export class EloChange {

  elo = input<PlayerElo>();

  public changeDir = computed<number>(() => {
    const elo = this.elo();
    if (elo) {
      if (elo.elo === elo.oldElo) {
        return 0;
      }
      return elo.elo - elo.oldElo;

    }
    return 0;
  });

}
