import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCategoryHazardComponent } from './master-category-hazard.component';

describe('MasterCategoryHazardComponent', () => {
  let component: MasterCategoryHazardComponent;
  let fixture: ComponentFixture<MasterCategoryHazardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterCategoryHazardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterCategoryHazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
