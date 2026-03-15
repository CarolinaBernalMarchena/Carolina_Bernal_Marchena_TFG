import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialTradeCard } from './special-trade-card';

describe('SpecialTradeCard', () => {
  let component: SpecialTradeCard;
  let fixture: ComponentFixture<SpecialTradeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialTradeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialTradeCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
