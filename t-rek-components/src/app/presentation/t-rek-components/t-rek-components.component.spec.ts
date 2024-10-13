import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TRekComponentsComponent } from './t-rek-components.component';

describe('TRekComponentsComponent', () => {
  let component: TRekComponentsComponent;
  let fixture: ComponentFixture<TRekComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TRekComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TRekComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
