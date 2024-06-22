import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmiSheetComponent } from './pmi-sheet.component';

describe('PmiSheetComponent', () => {
  let component: PmiSheetComponent;
  let fixture: ComponentFixture<PmiSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmiSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmiSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
