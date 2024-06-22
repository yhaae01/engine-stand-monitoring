import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmiDataComponent } from './pmi-data.component';

describe('PmiDataComponent', () => {
  let component: PmiDataComponent;
  let fixture: ComponentFixture<PmiDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmiDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmiDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
