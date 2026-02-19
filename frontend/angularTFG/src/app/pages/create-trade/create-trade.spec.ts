import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrade } from './create-trade';

describe('CreateTrade', () => {
  let component: CreateTrade;
  let fixture: ComponentFixture<CreateTrade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTrade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
