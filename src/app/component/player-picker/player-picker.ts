import { Component, inject, model, output } from '@angular/core';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { ChipModule } from 'primeng/chip';
import { PlayerService } from 'app/service/players.service';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [SelectModule, FormsModule, ChipModule],
  selector: 'app-player-picker',
  styleUrl: './player-picker.css',
  templateUrl: './player-picker.html',
})
export class PlayerPicker {

  names = model<string[]>([]);


  public playersService = inject(PlayerService);

  removeItem(event: MouseEvent, code: string) {
    event.stopPropagation();
    this.names.update(names => names.filter((c) => c !== code));
  }
}
