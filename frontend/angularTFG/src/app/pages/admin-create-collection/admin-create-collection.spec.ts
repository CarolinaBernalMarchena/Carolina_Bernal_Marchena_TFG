import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateCollection } from './admin-create-collection';

describe('AdminCreateCollection', () => {
  let component: AdminCreateCollection;
  let fixture: ComponentFixture<AdminCreateCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateCollection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateCollection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
