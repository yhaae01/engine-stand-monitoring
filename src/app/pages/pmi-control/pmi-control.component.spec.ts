import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmiControlComponent } from './pmi-control.component';

describe('PmiControlComponent', () => {
  let component: PmiControlComponent;
  let fixture: ComponentFixture<PmiControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmiControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmiControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
