import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSpecialTrades } from './admin-special-trades';

describe('AdminSpecialTrades', () => {
  let component: AdminSpecialTrades;
  let fixture: ComponentFixture<AdminSpecialTrades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSpecialTrades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSpecialTrades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
