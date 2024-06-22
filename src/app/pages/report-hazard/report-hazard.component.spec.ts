import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHazardComponent } from './report-hazard.component';

describe('ReportHazardComponent', () => {
  let component: ReportHazardComponent;
  let fixture: ComponentFixture<ReportHazardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportHazardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportHazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
