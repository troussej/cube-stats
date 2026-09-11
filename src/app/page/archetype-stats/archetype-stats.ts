import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { CardModule } from 'primeng/card';
import { ConfigService } from 'app/service/config.service';
import { DraftService } from 'app/service/drafts.service';
import { ChartConfiguration } from 'chart.js';
import _ from 'lodash';
import moment from 'moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  imports: [CardModule, SelectButtonModule, BaseChartDirective, FormsModule, ToggleSwitchModule],
  selector: 'app-archetype-stats',
  styleUrl: './archetype-stats.css',
  templateUrl: './archetype-stats.html',
})
export class ArchetypeStats {

  public draftService = inject(DraftService);
  public config = inject(ConfigService).config;

  public sortOrder = model<'winrate' | 'occurences'>('occurences');
  public actif = model<boolean>(true);

  public sortOrderOptions = [
    { label: 'Occurences', value: 'occurences' },
    { label: 'Winrate', value: 'winrate' },
  ];

  public cutoffDate = moment().add(-1 * this.config.nbMoisActif, 'months');

  public archetypesData = computed(() => {

    const res: { archetypes: { [type: string]: { wins: 0, games: 0 } }, total: number } = { archetypes: {}, total: 0 };

    return _.chain(this.draftService.drafts())
      .filter(d => !this.actif() || moment(d.date).isAfter(this.cutoffDate))
      .flatMap(d => d.players)

      .map(p => ({
        archetypes: this.extractArchetypes(p.deck),
        wins: p.wins,
        games: p.wins + p.losses + p.draws,
      }))
      .reduce((acc, curr) => {
        curr.archetypes.forEach(archetype => {
          if (!acc.archetypes[archetype]) {
            acc.archetypes[archetype] = { wins: 0, games: 0 };
          }
          acc.archetypes[archetype].wins += curr.wins;
          acc.archetypes[archetype].games += curr.games;
          acc.total += curr.games;
        });
        return acc;
      }, res)
      .value()

  });

  extractArchetypes(deckName: string): string[] {

    const match = this.config.deckNameRegex.exec(deckName);
    const description = match ? match[3] : '';
    return _.chain([description])
      .map(_.lowerCase)
      .map(d => { return _.reduce(this.config.archetypes.mapping, (acc, value, key) => acc.replaceAll(key, value), d) }
      )
      .split(' ')
      .flatMap(s => _.split(s, '/'))
      .map(_.trim)
      .filter(archetype => !this.config.archetypes.reject.includes(archetype.toLowerCase()))
      .map(_.capitalize)
      .value();
  }

  public chartData = computed(() => {

    const data = _.chain(this.archetypesData().archetypes)
      .map((d, archetype) => ({
        archetype,
        occurences: d.games > 0 ? Math.round((d.games / this.archetypesData().total) * 100) : 0,
        winrate: d.games > 0 ? Math.round((d.wins / d.games) * 100) : 0,
      }))
      .sortBy(this.sortOrder(), 'asc')
      .value();


    const dataSet = {
      labels: _.map(data, 'archetype'),
      occurences: _.map(data, 'occurences'),
      winrates: _.map(data, 'winrate'),
    };
    return this.buildBarChartData(dataSet);
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


  public plugins: ChartConfiguration['plugins'] = [ChartDataLabels];

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
