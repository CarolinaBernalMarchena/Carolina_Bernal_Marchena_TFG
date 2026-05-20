import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCosts } from './admin-costs';

describe('AdminCosts', () => {
  let component: AdminCosts;
  let fixture: ComponentFixture<AdminCosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCosts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
