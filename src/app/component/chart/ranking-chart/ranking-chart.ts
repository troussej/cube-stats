import { Component, computed, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DraftsStoreService } from 'app/service/drafts.service';
import _ from 'lodash';
import { Play } from '@primeicons/angular';
import { PlayerService } from 'app/service/players.service';
import { Debug } from 'app/component/debug/debug';

@Component({
  imports: [BaseChartDirective, Debug],
  selector: 'app-ranking-chart',
  styleUrl: './ranking-chart.css',
  templateUrl: './ranking-chart.html',
})
export class RankingChart {
  public draftStoreService = inject(DraftsStoreService);
  public playerService = inject(PlayerService);


  public plugins: ChartConfiguration['plugins'] = [];

  options: ChartConfiguration['options'] = {

    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      // datalabels: {
      //   color: '#fff',
      //   align: 'right',
      //   offset: 5,

      // },

      title: {
        display: false,
        text: 'Stats',
      }
    },
    scales: {
      //winrate
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

    console.log("buildEloData", dates);

    return _.chain(this.playerService.playersElo())
      .orderBy(['date'], ['asc'])
      .groupBy('player')
      .mapValues((changesOfPlayer, player) => _.groupBy(changesOfPlayer, (c) => c.game.date.toLocaleDateString()))
      .mapValues((changesOfPlayerByDate, player) => {

        return _.mapValues(changesOfPlayerByDate, (dateChanges) => _.maxBy(dateChanges, 'round')?.elo ?? 0)
      })
      .mapValues((dateToElo) => {

        return _.map(dates, (date) => dateToElo[date])
      })
      .map((chartData, player) => this.buildDataSet(chartData, player))
      .value();


    // .value();
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
      datasets: this.buildEloData()
    };
  });

}
