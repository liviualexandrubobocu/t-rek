import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TTypewriterComponent } from './t-typewriter.component';

describe('TTypewriterComponent', () => {
  let component: TTypewriterComponent;
  let fixture: ComponentFixture<TTypewriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TTypewriterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TTypewriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
