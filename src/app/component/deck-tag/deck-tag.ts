import { Component, computed, input } from '@angular/core';
import { Debug } from "../debug/debug";
import _ from 'lodash';
import { TagModule } from 'primeng/tag';


const SYMBOLS_RGX = /[WUBRG()]+/i

@Component({
  imports: [Debug, TagModule],
  selector: 'app-deck-tag',
  styleUrl: './deck-tag.css',
  templateUrl: './deck-tag.html',
})
export class DeckTag {

  public deckDescription = input.required<string>();


  public tag = computed(() => {
    // split the mana symbols from the rest of the description
    const symbols = this.deckDescription().match(SYMBOLS_RGX) || [];
    let manaString: string[] = [];
    if (symbols.length > 0) {
      manaString = _.values(symbols[0]?.toLowerCase());
    }
    const description = this.deckDescription().replace(SYMBOLS_RGX, '').trim();
    return { manaString, description };
  });

  public colorClass(s: string) {
    switch (s) {
      case 'w':
        return 'text-yellow-300';
      case 'u':
        return 'text-cyan-300';
      case 'b':
        return 'text-violet-300';;
      case 'r':
        return 'text-red-300';;
      case 'g':
        return 'text-green-300';;
    }
    return '';
  }
}
