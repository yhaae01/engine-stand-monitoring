import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingFormComponent } from './outgoing-form.component';

describe('OutgoingFormComponent', () => {
  let component: OutgoingFormComponent;
  let fixture: ComponentFixture<OutgoingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
