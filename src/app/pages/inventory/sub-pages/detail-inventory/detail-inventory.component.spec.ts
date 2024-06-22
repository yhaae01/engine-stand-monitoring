import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInventoryComponent } from './detail-inventory.component';

describe('DetailInventoryComponent', () => {
  let component: DetailInventoryComponent;
  let fixture: ComponentFixture<DetailInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
