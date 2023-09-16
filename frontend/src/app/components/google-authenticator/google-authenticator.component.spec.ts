import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAuthenticatorComponent } from './google-authenticator.component';

describe('GoogleAuthenticatorComponent', () => {
  let component: GoogleAuthenticatorComponent;
  let fixture: ComponentFixture<GoogleAuthenticatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleAuthenticatorComponent]
    });
    fixture = TestBed.createComponent(GoogleAuthenticatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
