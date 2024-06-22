import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterJobDescComponent } from './master-job-desc.component';

describe('MasterJobDescComponent', () => {
  let component: MasterJobDescComponent;
  let fixture: ComponentFixture<MasterJobDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterJobDescComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterJobDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
