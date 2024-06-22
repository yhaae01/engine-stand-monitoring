import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterEngineTypeComponent } from './master-engine-type.component';

describe('MasterEngineTypeComponent', () => {
  let component: MasterEngineTypeComponent;
  let fixture: ComponentFixture<MasterEngineTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterEngineTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterEngineTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
