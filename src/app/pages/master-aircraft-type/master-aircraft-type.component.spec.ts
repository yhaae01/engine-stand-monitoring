import { ComponentFixture, TestBed } from '@angular/core/testing';

import MasterAircraftTypeComponent from './master-aircraft-type.component';

describe('MasterAircraftTypeComponent', () => {
  let component: MasterAircraftTypeComponent;
  let fixture: ComponentFixture<MasterAircraftTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterAircraftTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MasterAircraftTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
