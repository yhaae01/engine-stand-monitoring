import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequestFormComponent } from './edit-request-form.component';

describe('EditRequestFormComponent', () => {
  let component: EditRequestFormComponent;
  let fixture: ComponentFixture<EditRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRequestFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
