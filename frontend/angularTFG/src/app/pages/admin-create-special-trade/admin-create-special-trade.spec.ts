import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateSpecialTrade } from './admin-create-special-trade';

describe('AdminCreateSpecialTrade', () => {
  let component: AdminCreateSpecialTrade;
  let fixture: ComponentFixture<AdminCreateSpecialTrade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateSpecialTrade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateSpecialTrade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
