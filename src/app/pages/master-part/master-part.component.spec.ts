import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPartComponent } from './master-part.component';

describe('MasterPartComponent', () => {
  let component: MasterPartComponent;
  let fixture: ComponentFixture<MasterPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterPartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
