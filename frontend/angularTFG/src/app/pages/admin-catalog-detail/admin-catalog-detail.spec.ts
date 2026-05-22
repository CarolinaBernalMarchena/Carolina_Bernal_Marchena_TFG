import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogDetail } from './admin-catalog-detail';

describe('AdminCatalogDetail', () => {
  let component: AdminCatalogDetail;
  let fixture: ComponentFixture<AdminCatalogDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
