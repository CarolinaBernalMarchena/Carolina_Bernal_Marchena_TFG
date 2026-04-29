import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeConfirmModal } from './trade-confirm-modal';

describe('TradeConfirmModal', () => {
  let component: TradeConfirmModal;
  let fixture: ComponentFixture<TradeConfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeConfirmModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeConfirmModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
