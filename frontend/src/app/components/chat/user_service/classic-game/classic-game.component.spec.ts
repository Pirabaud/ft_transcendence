import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicGameComponent } from './classic-game.component';

describe('ClassicGameComponent', () => {
  let component: ClassicGameComponent;
  let fixture: ComponentFixture<ClassicGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassicGameComponent]
    });
    fixture = TestBed.createComponent(ClassicGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
