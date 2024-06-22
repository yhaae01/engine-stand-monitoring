import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportHazardComponent } from './add-report-hazard.component';

describe('AddReportHazardComponent', () => {
  let component: AddReportHazardComponent;
  let fixture: ComponentFixture<AddReportHazardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReportHazardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReportHazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
