import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Square } from '@primeicons/angular/square';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule, Square, RouterLinkWithHref, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CUBE STATS');
  private router = inject(Router);
  public menuData: MenuItem[] = [];
  ngOnInit(): void {
    this.menuData = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          this.router.navigate(['']);
        }

      },
    ]
  }
}
