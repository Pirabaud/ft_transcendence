import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorFirstCoComponent } from './two-factor-first-co.component';

describe('TwoFactorFirstCoComponent', () => {
  let component: TwoFactorFirstCoComponent;
  let fixture: ComponentFixture<TwoFactorFirstCoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFactorFirstCoComponent]
    });
    fixture = TestBed.createComponent(TwoFactorFirstCoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
