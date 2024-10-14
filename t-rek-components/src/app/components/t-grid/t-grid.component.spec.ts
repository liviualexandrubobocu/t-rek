import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { TGridComponent } from './t-grid.component';
import { TColumnComponent } from '../t-column/t-column.component';
import { TRANSLOCO_TRANSPILER, TranslocoService } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size, Theme } from '../../types/theme';

class MockTranslocoService {
  selectTranslate(key: string) {
    return of(key);
  }
}

interface TestData {
  id: number;
  name: string;
  value: number;
}

@Component({
    selector: 't-host',
    template: `
      <t-grid
        [data]="data"
        [sortable]="sortable"
        [pageSize]="pageSize"
        [theme]="theme"
        [size]="size"
        (sortChange)="onSortChange($event)"
        (paginationChange)="onPaginationChange($event)"
      >
        <t-column [property]="'id'" [sortable]="true"></t-column>
        <t-column [property]="'name'" [sortable]="true"></t-column>
        <t-column [property]="'value'" [sortable]="false"></t-column>
      </t-grid>
    `,
  })
  class TestHostComponent {
    data: TestData[] | Observable<TestData[]> = [];
    sortable = true;
    pageSize: number | null = null;
    theme: Theme = 'light';
    size: Size = 'medium';  
    paginationChange(){
        console.log('pagination change event')
    } 
  
    onSortChange(event: unknown) {
        console.log(event);
    }
    onPaginationChange(event: unknown) {
        console.log(event);
    }
    goToPage(nr: number){
        console.log(nr);
    }
  }

describe('TGridComponent', () => {
  let component: TGridComponent<TestData>;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [CommonModule, TGridComponent, TColumnComponent],
      providers: [
        { provide: TranslocoService, useClass: MockTranslocoService },
        {
          provide: TRANSLOCO_TRANSPILER,
          useValue: {
            transpile(value: string) {
              return value;
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = fixture.componentInstance;
    fixture.detectChanges();

    const gridDebugElement = fixture.debugElement.query(
      By.directive(TGridComponent)
    );
    component = gridDebugElement.componentInstance;
  });

  it('should create the grid component', () => {
    expect(component).toBeTruthy();
  });

  it('should display data rows', () => {
    testHostComponent.data = [
      { id: 1, name: 'Item 1', value: 10 },
      { id: 2, name: 'Item 2', value: 20 },
    ];
    fixture.detectChanges();

    component.processedData$.subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data[0].id).toBe(1);
    });
  });

  it('should sort data when header is clicked', () => {
    testHostComponent.data = [
      { id: 2, name: 'Item 2', value: 20 },
      { id: 1, name: 'Item 1', value: 10 },
    ];
    fixture.detectChanges();

    const idColumnComponent = component.columns.find(
      (column) => column.property === 'id'
    );
    component.onHeaderClick(idColumnComponent!);
    fixture.detectChanges();

    component.processedData$.subscribe((data) => {
      expect(data[0].id).toBe(1);
      expect(data[1].id).toBe(2);
    });
  });

  it('should emit sortChange event when sorting', () => {
    spyOn(testHostComponent, 'onSortChange');
    testHostComponent.data = [
      { id: 2, name: 'Item 2', value: 20 },
      { id: 1, name: 'Item 1', value: 10 },
    ];
    fixture.detectChanges();

    const idColumnComponent = component.columns.find(
      (column) => column.property === 'id'
    );
    component.onHeaderClick(idColumnComponent!);
    fixture.detectChanges();

    expect(testHostComponent.onSortChange).toHaveBeenCalledWith({
      columnName: 'id',
      direction: 'asc',
    });
  });

  it('should paginate data when pageSize is set', fakeAsync(() => {
    testHostComponent.data = [
      { id: 1, name: 'Item 1', value: 10 },
      { id: 2, name: 'Item 2', value: 20 },
      { id: 3, name: 'Item 3', value: 30 },
      { id: 4, name: 'Item 4', value: 40 },
    ];
    testHostComponent.pageSize = 2;

    fixture.detectChanges();
    tick(); 

    
    const dataEmissions: TestData[][] = [];
    const subscription = component.processedData$.subscribe((data) => {
      dataEmissions.push(data);
    });
   
    expect(dataEmissions.length).toBeGreaterThanOrEqual(1);
    expect(dataEmissions[0].length).toBe(2);
    expect(dataEmissions[0][0].id).toBe(1);
    expect(dataEmissions[0][1].id).toBe(2);

    component.goToPage(2);
    fixture.detectChanges();
    tick();

    expect(dataEmissions.length).toBeGreaterThanOrEqual(2);
    expect(dataEmissions[1].length).toBe(2);
    expect(dataEmissions[1][0].id).toBe(3);
    expect(dataEmissions[1][1].id).toBe(4);

    subscription.unsubscribe();
  }));

  it('should not sort data if sortable is false', () => {
    testHostComponent.sortable = false;
    testHostComponent.data = [
      { id: 2, name: 'Item 2', value: 20 },
      { id: 1, name: 'Item 1', value: 10 },
    ];
    fixture.detectChanges();

    const idColumnComponent = component.columns.find(
      (column) => column.property === 'id'
    );
    component.onHeaderClick(idColumnComponent!);
    fixture.detectChanges();

    component.processedData$.subscribe((data) => {
      expect(data[0].id).toBe(2);
      expect(data[1].id).toBe(1);
    });
  });

  it('should use provided translations', () => {
    component.pageText$.subscribe((text) => {
      expect(text).toBe('lib.grid.pageText');
    });
  });

  it('should handle data as Observable', () => {
    testHostComponent.data = of([
      { id: 1, name: 'Item 1', value: 10 },
      { id: 2, name: 'Item 2', value: 20 },
    ]);
    fixture.detectChanges();

    component.processedData$.subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data[0].id).toBe(1);
    });
  });
});
