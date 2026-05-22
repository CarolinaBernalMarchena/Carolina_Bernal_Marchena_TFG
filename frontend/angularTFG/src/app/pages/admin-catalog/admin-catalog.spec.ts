import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalog } from './admin-catalog';

describe('AdminCatalog', () => {
  let component: AdminCatalog;
  let fixture: ComponentFixture<AdminCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
