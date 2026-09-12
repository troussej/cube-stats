import { Component, input } from '@angular/core';

import { PopoverModule } from 'primeng/popover';
import { Image } from '@primeicons/angular/image';
import { ButtonModule } from 'primeng/button';
@Component({
  imports: [PopoverModule, Image, ButtonModule],
  selector: 'app-img-popover',
  styleUrl: './img-popover.css',
  templateUrl: './img-popover.html',
})
export class ImgPopover {

  public imgSrc = input<string>();

}
