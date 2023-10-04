import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalGameComponent } from './portal-game.component';

describe('PortalGameComponent', () => {
  let component: PortalGameComponent;
  let fixture: ComponentFixture<PortalGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortalGameComponent]
    });
    fixture = TestBed.createComponent(PortalGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
