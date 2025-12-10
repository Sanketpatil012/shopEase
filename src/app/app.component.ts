import { Component, AfterViewInit, OnInit, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private _router: Router) {}
  ngOnInit(): void {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.getAndSetDynamicHeight();
        },200);
      }
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getAndSetDynamicHeight();
    }, 200);
  }
  title = 'webapp';

  @HostListener('window:resize')
  onResize() {
    this.getAndSetDynamicHeight();
  }

  private getAndSetDynamicHeight() {
    const header = document.getElementsByClassName(
      'app-header-main'
    ) as HTMLCollectionOf<HTMLElement>;
    const haederHeight = header[0].clientHeight;
    const router = document.getElementsByClassName(
      'main-router'
    ) as HTMLCollectionOf<HTMLElement>;
    router[0].style.marginTop = `${haederHeight}px`;
  }
}
