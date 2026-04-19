import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BindAccountComponent } from './bind-account.component';

describe('BindAccountComponent', () => {
  let component: BindAccountComponent;
  let fixture: ComponentFixture<BindAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BindAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BindAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
