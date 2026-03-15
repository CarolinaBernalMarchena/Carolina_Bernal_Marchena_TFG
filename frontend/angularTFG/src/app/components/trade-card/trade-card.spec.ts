import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeCard } from './trade-card';

describe('TradeCard', () => {
  let component: TradeCard;
  let fixture: ComponentFixture<TradeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
