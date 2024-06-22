import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertPmiDataComponent } from './insert-pmi-data.component';

describe('InsertPmiDataComponent', () => {
  let component: InsertPmiDataComponent;
  let fixture: ComponentFixture<InsertPmiDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertPmiDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertPmiDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
