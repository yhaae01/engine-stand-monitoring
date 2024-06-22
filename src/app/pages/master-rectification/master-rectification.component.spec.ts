import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRectificationComponent } from './master-rectification.component';

describe('MasterRectificationComponent', () => {
  let component: MasterRectificationComponent;
  let fixture: ComponentFixture<MasterRectificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterRectificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterRectificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
