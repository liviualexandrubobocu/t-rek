import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TThemeToggleComponent } from './t-theme-toggle.component';

describe('TThemeToggleComponent', () => {
  let component: TThemeToggleComponent;
  let fixture: ComponentFixture<TThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TThemeToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
