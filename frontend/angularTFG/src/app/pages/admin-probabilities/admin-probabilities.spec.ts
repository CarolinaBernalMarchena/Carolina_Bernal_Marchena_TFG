import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProbabilities } from './admin-probabilities';

describe('AdminProbabilities', () => {
  let component: AdminProbabilities;
  let fixture: ComponentFixture<AdminProbabilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProbabilities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProbabilities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
