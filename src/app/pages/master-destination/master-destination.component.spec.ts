import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDestinationComponent } from './master-destination.component';

describe('MasterDestinationComponent', () => {
  let component: MasterDestinationComponent;
  let fixture: ComponentFixture<MasterDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDestinationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
