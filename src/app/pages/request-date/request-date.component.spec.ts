import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDateComponent } from './request-date.component';

describe('RequestDateComponent', () => {
  let component: RequestDateComponent;
  let fixture: ComponentFixture<RequestDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
