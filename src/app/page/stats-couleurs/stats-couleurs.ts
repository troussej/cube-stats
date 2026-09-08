import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DraftService } from 'app/service/drafts.service';
import _ from 'lodash';
import { PanelModule } from "primeng/panel";
import { Debug } from "app/component/debug/debug";
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Legend, Title } from 'chart.js';
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


const SYMBOLS_RGX = /([WUBRG]+)(\([WUBRG]+\))?.*/i

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
      .map(this.extractColorInfo)
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
    return [
      Math.round(stats.w / stats.total * 100),
      Math.round(stats.u / stats.total * 100),
      Math.round(stats.b / stats.total * 100),
      Math.round(stats.r / stats.total * 100),
      Math.round(stats.g / stats.total * 100)
    ]

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
          count: Math.round(count / stats.total * 100),
          winrate: Math.round((stats.combosWinrate[combo] || 0) / count * 100)
        }))
      .sortBy(this.combosSortOrder(), 'desc')
      .value()

    return {
      labels: occur.map(r => r.combo),
      occurences: occur.map(r => r.count),
      winrates: occur.map(r => r.winrate),
    };

  });

  public buildBarChartData(dataSet: { labels: string[], occurences: number[], winrates: number[] }) {

    return {
      labels: dataSet.labels,
      datasets: [
        {
          label: 'Occurences',
          data: dataSet.occurences,
          //  borderColor: '#fff',
          // borderWidth: 1,
          backgroundColor: Object.values(this.config.colors),
          borderRadius: 5,
          yAxisID: 'y',
        },
        {
          label: 'Winrate',
          data: dataSet.winrates,
          borderColor: '#fff',
          borderWidth: 1,
          backgroundColor: '#222',
          borderRadius: 5,
          yAxisID: 'percent',
        }
      ]
    };
  }

  public buildPieChartData(dataSet: number[]) {

    return {
      labels: ['W', 'U', 'B', 'R', 'G'],
      datasets: [
        {
          data: dataSet,
          backgroundColor: Object.values(this.config.colors),

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

    return [
      Math.round(stats.w / stats.wTotal * 100),
      Math.round(stats.u / stats.uTotal * 100),
      Math.round(stats.b / stats.bTotal * 100),
      Math.round(stats.r / stats.rTotal * 100),
      Math.round(stats.g / stats.gTotal * 100)
    ]
  });

  public extractColorInfo(deck: string): DeckInfo {
    const match = SYMBOLS_RGX.exec(deck);
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

  public options: ChartConfiguration['options'] = {

    responsive: true,
    maintainAspectRatio: true,
    borderColor: '#18181b',

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
          return value + "%";
        },

        color: '#000',
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
          return value + "%";
        },

        color: '#fff',
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
