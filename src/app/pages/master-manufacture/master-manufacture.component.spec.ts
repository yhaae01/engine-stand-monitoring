import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterManufactureComponent } from './master-manufacture.component';

describe('MasterManufactureComponent', () => {
  let component: MasterManufactureComponent;
  let fixture: ComponentFixture<MasterManufactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterManufactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
