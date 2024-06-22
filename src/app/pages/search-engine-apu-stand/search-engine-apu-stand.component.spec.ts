import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEngineApuStandComponent } from './search-engine-apu-stand.component';

describe('SearchEngineApuStandComponent', () => {
  let component: SearchEngineApuStandComponent;
  let fixture: ComponentFixture<SearchEngineApuStandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchEngineApuStandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchEngineApuStandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
