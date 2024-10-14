import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TRekComponentsComponent } from './presentation/t-rek-components/t-rek-components.component';

@Component({
  selector: 't-root',
  standalone: true,
  imports: [RouterOutlet, TRekComponentsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
