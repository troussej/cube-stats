import { Component, input } from '@angular/core';
import { DraftPlayer, DraftSession, PlayerEloChange } from 'app/model/model';
import { RoundResult } from "../round-result/round-result";
import { CardModule } from 'primeng/card';
import { Debug } from "../debug/debug";
import { DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { SplitterModule } from 'primeng/splitter';
import { DeckTag } from "../deck-tag/deck-tag";

import { TableModule } from "primeng/table";
import _ from 'lodash';
import { EloChange } from "../elo-change/elo-change";

@Component({
  imports: [RoundResult, PanelModule, Debug, DatePipe, TagModule, DeckTag, SplitterModule, TableModule, EloChange],
  selector: 'app-draft-result',
  styleUrl: './draft-result.css',
  templateUrl: './draft-result.html',
})
export class DraftResult {

  public draftSession = input.required<DraftSession>();


  public totalEloChange(player: DraftPlayer, draftSession: DraftSession) {

    const changes = _.chain(draftSession.games)
      .filter(game => game.player1 === player.name || game.player2 === player.name)
      .map(game => game.player1 === player.name ?
        { eloChange: game.eloChange1, round: game.round } : { eloChange: game.eloChange2, round: game.round })

      .value();

    const before = _.minBy(changes, 'round')?.eloChange?.oldElo ?? 0;
    const after = _.maxBy(changes, 'round')?.eloChange?.elo ?? 0;
    return new PlayerEloChange(player.name, after, before, draftSession.date, 0);
  }
}
