import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestFormComponent } from './add-request-form.component';

describe('AddRequestFormComponent', () => {
  let component: AddRequestFormComponent;
  let fixture: ComponentFixture<AddRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequestFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
