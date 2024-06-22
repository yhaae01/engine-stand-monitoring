import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmiPartDetailComponent } from './pmi-part-detail.component';

describe('PmiPartDetailComponent', () => {
  let component: PmiPartDetailComponent;
  let fixture: ComponentFixture<PmiPartDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmiPartDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmiPartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
