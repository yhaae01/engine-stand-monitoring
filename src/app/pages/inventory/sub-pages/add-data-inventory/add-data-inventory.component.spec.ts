import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDataInventoryComponent } from './add-data-inventory.component';

describe('AddDataInventoryComponent', () => {
  let component: AddDataInventoryComponent;
  let fixture: ComponentFixture<AddDataInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDataInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDataInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
