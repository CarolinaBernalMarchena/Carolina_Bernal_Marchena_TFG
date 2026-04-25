import { TestBed } from '@angular/core/testing';

import { AchievementNotification } from './achievement-notification';

describe('AchievementNotification', () => {
  let service: AchievementNotification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchievementNotification);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
