import { Routes } from '@angular/router';
import { HomePage } from './page/home-page/home-page';
import { PlayerStats } from './page/player-stats/player-stats';
import { StatsCouleurs } from './page/stats-couleurs/stats-couleurs';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'player', component: PlayerStats, },
    { path: 'player/:name', component: PlayerStats, },
    { path: 'colors', component: StatsCouleurs, },
];
