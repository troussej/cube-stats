import { Component, computed, inject, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DraftsStoreService } from 'app/service/drafts.service';
import _ from 'lodash';
import { Play } from '@primeicons/angular';
import { PlayerService } from 'app/service/players.service';
import { Debug } from 'app/component/debug/debug';
import { PlayerEloChange } from 'app/model/model';

@Component({
  imports: [BaseChartDirective, Debug],
  selector: 'app-player-elo-chart',
  styleUrl: './player-elo-chart.css',
  templateUrl: './player-elo-chart.html',
})
export class PlayerEloChart {
  public draftStoreService = inject(DraftsStoreService);
  public playerService = inject(PlayerService);

  public player = input.required<string>();

  public plugins: ChartConfiguration['plugins'] = [];

  options: ChartConfiguration['options'] = {

    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,

    },

    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
      }
    },
    scales: {

      elo: {
        type: 'linear',
        display: true,
        position: 'left',
      }
    }
  };

  public dateLabels = computed<string[]>(() => {
    return _.chain(this.draftStoreService.drafts())
      .orderBy(['date'], ['asc'])
      .map(draft => draft.id)

      .value();
  });

  public buildEloData = computed(() => {

    const dates = _.chain(this.draftStoreService.drafts())
      .orderBy(['date'], ['asc'])
      .map(draft => draft.date.toLocaleDateString())
      .value();

    const dateToElo = _.chain(this.playerService.playersElo())
      .filter({ 'player': this.player() })
      .orderBy(['game.date'], ['asc'])
      .groupBy((c: PlayerEloChange) => c.game.date.toLocaleDateString())
      .mapValues((changesOfPlayerByDate, date) => {

        return _.maxBy(changesOfPlayerByDate, 'game.round')?.elo ?? 0;
      })
      .value();

    return _.chain(dates)
      .map((date) => {
        return dateToElo[date];
      })
      .value();



  });

  public buildDataSet(chartData: any, player: string) {
    return {
      label: player,
      data: chartData,
      yAxisID: 'elo',
    };
  }

  public data = computed<ChartConfiguration['data']>(() => {
    return {
      labels: this.dateLabels(),
      datasets: [
        {
          label: this.player(),
          data: this.buildEloData(),
          yAxisID: 'elo',
          cubicInterpolationMode: 'monotone',
          fill: true,
          spanGaps: true
        }
      ]
    };
  });

}
