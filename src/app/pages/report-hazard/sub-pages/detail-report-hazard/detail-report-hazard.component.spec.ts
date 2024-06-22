import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReportHazardComponent } from './detail-report-hazard.component';

describe('DetailReportHazardComponent', () => {
  let component: DetailReportHazardComponent;
  let fixture: ComponentFixture<DetailReportHazardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailReportHazardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailReportHazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
