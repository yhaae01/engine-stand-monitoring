import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDataInventoryComponent } from './edit-data-inventory.component';

describe('EditDataInventoryComponent', () => {
  let component: EditDataInventoryComponent;
  let fixture: ComponentFixture<EditDataInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDataInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDataInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
