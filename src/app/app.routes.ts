import { Routes } from '@angular/router';
import { HomePage } from './page/home-page/home-page';
import { PlayerStats } from './page/player-stats/player-stats';
import { StatsCouleurs } from './page/stats-couleurs/stats-couleurs';
import { ArchetypeStats } from './page/archetype-stats/archetype-stats';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'player', component: PlayerStats, },
    { path: 'player/:name', component: PlayerStats, },
    { path: 'colors', component: StatsCouleurs, },
    { path: 'archetypes', component: ArchetypeStats, },
];
