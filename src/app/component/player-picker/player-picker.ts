import { Component, inject, model, output } from '@angular/core';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { PlayerService } from 'app/service/players.service';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [SelectModule, FormsModule],
  selector: 'app-player-picker',
  styleUrl: './player-picker.css',
  templateUrl: './player-picker.html',
})
export class PlayerPicker {

  name = model<string>();


  public playersService = inject(PlayerService);


}
