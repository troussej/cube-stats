import { Component, input } from '@angular/core';
import { DraftSession } from 'app/model/model';
import { RoundResult } from "../round-result/round-result";
import { CardModule } from 'primeng/card';
import { Debug } from "../debug/debug";
import { DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';

@Component({
  imports: [RoundResult, PanelModule, Debug, DatePipe, TagModule],
  selector: 'app-draft-result',
  styleUrl: './draft-result.css',
  templateUrl: './draft-result.html',
})
export class DraftResult {

  public draftSession = input.required<DraftSession>();

}
