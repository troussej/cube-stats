import { Routes } from '@angular/router';
import { HomePage } from './page/home-page/home-page';
import { PlayerStats } from './page/player-stats/player-stats';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'player/:name', component: PlayerStats, },
];
