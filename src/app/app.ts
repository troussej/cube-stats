import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Square } from '@primeicons/angular/square';
import { ConfigService } from './service/config.service';
import { AvatarModule } from 'primeng/avatar';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule, Square, RouterLinkWithHref, RouterLink, AvatarModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CUBE STATS');
  private router = inject(Router);
  public menuData: MenuItem[] = [];
  private config = inject(ConfigService).config;

  ngOnInit(): void {
    this.menuData = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          this.router.navigate(['']);
        }

      },
      {
        label: 'Joueurs',
        icon: 'pi pi-users',
        command: () => {
          this.router.navigate(['player']);
        }

      },
      {
        label: 'Stats couleurs',
        icon: 'pi pi-palette',
        command: () => {
          this.router.navigate(['colors']);
        }

      },
      {
        label: 'Archétypes',
        icon: 'pi pi-sitemap',
        command: () => {
          this.router.navigate(['archetypes']);
        }

      },
      {
        label: 'Liste du cube',
        customIcon: 'material-symbols-outlined text-[20px]!',
        customIconText: 'deployed_code',
        command: () => {
          window.open(this.config.cubeUrl, '_blank');
        }

      },
    ]
  }

}
