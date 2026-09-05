import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DraftPlayer, DraftSession, Game, PlayerEloChange } from 'app/model/model';
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
import { PlayerService } from 'app/service/players.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RoundResult, PanelModule, Debug, DatePipe, TagModule, DeckTag, SplitterModule, TableModule, EloChange, RouterLink],
  selector: 'app-draft-result',
  styleUrl: './draft-result.css',
  templateUrl: './draft-result.html',
})
export class DraftResult {

  public draftSession = input.required<DraftSession>();
  public playerService = inject(PlayerService);




}
