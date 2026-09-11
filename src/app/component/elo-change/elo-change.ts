import { Component, computed, input } from '@angular/core';
import { PlayerEloChange } from 'app/model/model';
import { ArrowDownRight, ArrowUpRight, ArrowRight } from '@primeicons/angular';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  imports: [ArrowUpRight, ArrowDownRight, ArrowRight, TooltipModule],
  selector: 'app-elo-change',
  styleUrl: './elo-change.css',
  templateUrl: './elo-change.html',
})
export class EloChange {

  elo = input<PlayerEloChange>();

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

  diff = computed<string>(() => {
    if (this.changeDir() === 0) {
      return '=';
    }
    const elo = this.elo();
    let sign = '=';
    if (this.changeDir() > 0) {
      sign = '+';
    } else if (this.changeDir() < 0) {
      sign = '';
    }
    if (elo) {
      return sign + (elo.elo - elo.oldElo);
    }
    return '=';
  });

}
