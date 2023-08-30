import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHandlerComponent } from './login-handler.component';

describe('LoginHandlerComponent', () => {
  let component: LoginHandlerComponent;
  let fixture: ComponentFixture<LoginHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginHandlerComponent]
    });
    fixture = TestBed.createComponent(LoginHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
