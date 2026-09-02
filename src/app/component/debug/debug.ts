import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-debug',
  imports: [JsonPipe],
  templateUrl: './debug.html',
  styleUrl: './debug.css',
})
export class Debug {
  public data = input<any>();
}
