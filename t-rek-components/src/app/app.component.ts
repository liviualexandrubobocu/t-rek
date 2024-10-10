import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TColumnComponent } from './components/t-column/t-column.component';
import { TGridComponent } from './components/t-grid/t-grid.component';
import { TProgressComponent } from './components/t-progress/t-progress.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TGridComponent, TColumnComponent, TProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  theme: 'light' | 'dark' = 'light';
  size: 'small' | 'medium' | 'large' = 'medium'; 
  progressValue: number = 0;
  interval: NodeJS.Timeout | undefined;
  animationId: number | undefined;

  ngOnInit() {
    this.animationId = requestAnimationFrame(() => this.increaseLoader()); 
  }

  increaseLoader(){
    if (this.progressValue < 100) {
      this.progressValue += 5;
    }
    requestAnimationFrame(() => this.increaseLoader()); 
  }

  myData = [
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
    { firstName: 'Alice', lastName: 'Smith', age: 30 },
    { firstName: 'Bob', lastName: 'Johnson', age: 25 },
    { firstName: 'Charlie', lastName: 'Brown', age: 35 },
  ];

  performFetch(event: { currentPage: number; pageSize: number | null }) {
    console.log('Pagination event:', event);
  }

  onProgressComplete() {
    console.log('Progress Complete!');
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  ngOnDestroy(){
    cancelAnimationFrame(this.animationId as number);
  }
}
