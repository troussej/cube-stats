import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DraftService } from 'app/service/drafts.service';
import _ from 'lodash';
import { PanelModule } from "primeng/panel";
import { Debug } from "app/component/debug/debug";
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartTypeRegistry, Legend, Title, TooltipCallbacks, TooltipItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CardModule } from 'primeng/card';
import { ConfigService } from 'app/service/config.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import moment from 'moment';


interface DeckInfo {
  archetype: string;
  colors: string[];
  splash: string[];
  w: boolean;
  u: boolean;
  b: boolean;
  r: boolean;
  g: boolean;
}




@Component({
  imports: [PanelModule, BaseChartDirective, Debug, CardModule, SelectButtonModule, FormsModule, ToggleSwitchModule],
  selector: 'app-stats-couleurs',
  styleUrl: './stats-couleurs.css',
  templateUrl: './stats-couleurs.html',
})
export class StatsCouleurs {

  public draftService = inject(DraftService);
  public config = inject(ConfigService).config;

  public combosSortOrder = model<'winrate' | 'count'>('count');
  public actif = model<boolean>(true);

  public comboSortOrderOptions = [
    { label: 'Occurences', value: 'count' },
    { label: 'Winrate', value: 'winrate' },
  ];

  public colorRepartitionStats = computed(() => {

    const cutoffDate = moment().add(-1 * this.config.nbMoisActif, 'months');

    // for each color, compute the number of times it appears in decks for all drafts
    const stats = _.chain(this.draftService.drafts())
      .filter(d => !this.actif() || moment(d.date).isAfter(cutoffDate))
      .flatMap(d => d.players)
      .map(p => p.deck)
      .map(this.extractColorInfo.bind(this))
      .reduce((acc, deck) => {

        acc.w += deck.w ? 1 : 0;
        acc.u += deck.u ? 1 : 0;
        acc.b += deck.b ? 1 : 0;
        acc.r += deck.r ? 1 : 0;
        acc.g += deck.g ? 1 : 0;
        acc.total += 1;
        return acc;
      }, {
        w: 0,
        u: 0,
        b: 0,
        r: 0,
        g: 0,
        total: 0
      })
      .value();
    const res = {
      W: [Math.round(stats.w / stats.total * 100)],
      U: [Math.round(stats.u / stats.total * 100)],
      B: [Math.round(stats.b / stats.total * 100)],
      R: [Math.round(stats.r / stats.total * 100)],
      G: [Math.round(stats.g / stats.total * 100)]
    };

    _.forEach(res, (value, key) => {
      value.push(100 - value[0]);
    });

    return res;
  });

  public colorComboRepartitionStats = computed(() => {

    const cutoffDate = moment().add(-1 * this.config.nbMoisActif, 'months');


    // for each color, compute the number of times it appears in decks for all drafts
    const stats = _.chain(this.draftService.drafts())
      .filter(d => !this.actif() || moment(d.date).isAfter(cutoffDate))
      .flatMap(d => d.players)
      // .map(p => p.deck)
      .map(p => ({ deck: p.deck, wins: p.wins, games: p.wins + p.losses + p.draws }))
      .map(data => ({ colorInfo: this.extractColorInfo(data.deck), wins: data.wins, games: data.games }))
      // .map(this.extractColorInfo)
      .filter(data => data.colorInfo.colors.length > 0)
      .reduce((acc, data) => {

        const comboKey = data.colorInfo.colors.join('');
        acc.combosNb[comboKey] = (acc.combosNb[comboKey] || 0) + data.games;
        acc.combosWinrate[comboKey] = (acc.combosWinrate[comboKey] || 0) + data.wins;
        acc.total += data.games;
        return acc;
      }, {
        combosNb: {} as { [key: string]: number },
        combosWinrate: {} as { [key: string]: number },
        total: 0
      })
      .value();

    const occur = _.chain(stats.combosNb)
      .map((count, combo) => (
        {
          combo: this.config.colorOrder[combo as keyof typeof this.config.colorOrder] || combo,
          count,
          winrate: Math.round((stats.combosWinrate[combo] || 0) / count * 100)
        }))
      .sortBy(this.combosSortOrder(), 'desc')
      .value()

    return {
      labels: occur.map(r => r.combo),
      occurences: occur.map(r => r.count),
      winrates: occur.map(r => r.winrate)
    };

  });

  public buildBarChartData(dataSet: { [key: string]: (string | number)[] }) {

    return {
      labels: dataSet['labels'],
      datasets: [
        {
          label: 'Occurences',
          data: dataSet['occurences'],
          //  borderColor: '#fff',
          // borderWidth: 1,
          backgroundColor: Object.values(this.config.colors),
          borderRadius: 5,
          yAxisID: 'y',

        },
        {
          label: 'Winrate',
          data: dataSet['winrates'],
          borderColor: '#fff',
          borderWidth: 1,
          backgroundColor: '#222',
          borderRadius: 5,
          yAxisID: 'percent',
        },

      ]
    };
  }

  public buildPieChartData(dataSet: {
    W: number[];
    U: number[];
    B: number[];
    R: number[];
    G: number[];
  }) {

    return {
      labels: ['W', 'U', 'B', 'R', 'G'],
      datasets: [
        {
          label: 'W',
          backgroundColor: [this.config.colors.W, 'rgba(0,0,0,0)'],
          data: dataSet.W,
          //  backgroundColor: Object.values(this.config.colors),

        },
        {
          label: 'U',
          backgroundColor: [this.config.colors.U, 'rgba(0,0,0,0)'],
          data: dataSet.U,
        },
        {
          label: 'B',
          backgroundColor: [this.config.colors.B, 'rgba(0,0,0,0)'],
          data: dataSet.B,
        },
        {
          label: 'R',
          backgroundColor: [this.config.colors.R, 'rgba(0,0,0,0)'],
          data: dataSet.R,
        },
        {
          label: 'G',
          backgroundColor: [this.config.colors.G, 'rgba(0,0,0,0)'],
          data: dataSet.G,
        }
      ]
    };
  }

  public colorWinrateStats = computed(() => {
    const cutoffDate = moment().add(-1 * this.config.nbMoisActif, 'months');
    // for each color, compute the number of times it appears in decks for all drafts
    const stats = _.chain(this.draftService.drafts())
      .filter(d => !this.actif() || moment(d.date).isAfter(cutoffDate))
      .flatMap(d => d.players)
      .map(p => ({ deck: p.deck, wins: p.wins, games: p.wins + p.losses + p.draws }))
      .map(data => ({ colorInfo: this.extractColorInfo(data.deck), wins: data.wins, games: data.games }))
      .reduce((acc, data) => {
        const colorInfo = data.colorInfo;
        acc.w += colorInfo.w ? data.wins : 0;
        acc.u += colorInfo.u ? data.wins : 0;
        acc.b += colorInfo.b ? data.wins : 0;
        acc.r += colorInfo.r ? data.wins : 0;
        acc.g += colorInfo.g ? data.wins : 0;
        acc.total += data.games;
        acc.wTotal += colorInfo.w ? data.games : 0;
        acc.uTotal += colorInfo.u ? data.games : 0;
        acc.bTotal += colorInfo.b ? data.games : 0;
        acc.rTotal += colorInfo.r ? data.games : 0;
        acc.gTotal += colorInfo.g ? data.games : 0;
        return acc;
      }, {
        w: 0,
        u: 0,
        b: 0,
        r: 0,
        g: 0,
        total: 0,
        wTotal: 0,
        uTotal: 0,
        bTotal: 0,
        rTotal: 0,
        gTotal: 0,

      })
      .value();

    const res = {
      W: [Math.round(stats.w / stats.wTotal * 100)],
      U: [Math.round(stats.u / stats.uTotal * 100)],
      B: [Math.round(stats.b / stats.bTotal * 100)],
      R: [Math.round(stats.r / stats.rTotal * 100)],
      G: [Math.round(stats.g / stats.gTotal * 100)]
    };
    _.forEach(res, (value, key) => {
      value.push(100 - value[0]);
    });
    return res;
  });

  public extractColorInfo(deck: string): DeckInfo {
    const match = this.config.deckNameRegex.exec(deck);
    const colors = match ? match[1]?.split('') : [];
    const splash = match ? match[2]?.split('') : [];
    return {
      archetype: match ? match[3] : '',
      colors: _.sortBy(colors),
      splash,
      w: colors.includes('W'),
      u: colors.includes('U'),
      b: colors.includes('B'),
      r: colors.includes('R'),
      g: colors.includes('G'),
    };
  }



  public plugins: ChartConfiguration['plugins'] = [ChartDataLabels];

  public optionsPie: ChartConfiguration['options'] = {

    responsive: true,
    maintainAspectRatio: true,
    borderColor(context: any) {
      if (context.dataIndex === 1) {
        return 'transparent';
      }
      return '#18181b';

    },

    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
      },
      datalabels: {
        display: true,

        formatter: (value: number, context: any) => {
          if (context.dataIndex === 1) {
            return '';
          }
          return value + "%";
        },

        color: '#000',
        font: {
          size: 11
        }
      },
      tooltip: {
        filter(e, index, array, data) {
          return e.dataIndex === 0;
        },
        callbacks: {
          title(tooltipItems) {
            return '';
          },
          label: (context: TooltipItem<keyof ChartTypeRegistry>) => {
            if (context.dataIndex === 1) {
              return '';
            }
            const value = context.raw || 0;
            return value + '%';

          }
        }
      }
    },
    scales: {


    }
  };

  public optionsBar: ChartConfiguration['options'] = {

    responsive: true,
    maintainAspectRatio: true,
    borderColor: '#18181b',

    plugins: {
      legend: {
        display: true
      },
      title: {
        display: false,
      },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'end',
        font: {
          size: 10,
        },
        formatter: (value: number, context: any) => {
          if (context.datasetIndex == 0) {
            return value;
          }
          return value + "%";
        },

        color: '#fff',
      },
      tooltip: {
        mode: 'index',

        callbacks: {

          label: (context: any) => {
            if (context.datasetIndex == 0) { // occurences
              const value = context.raw || 0;
              const total = context.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
              return `Nb: ${value} (${((value / total) * 100).toFixed(0)}%)`;
            } else { // winrate
              const value = context.raw || 0;
              return `Winrate: ${value}%`;
            }
          }
        }
      }
    },
    scales: {

      percent: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => value + '%'
        }
      }
    }
  };


}
