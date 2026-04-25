import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBubbles } from './chat-bubbles';

describe('ChatBubbles', () => {
  let component: ChatBubbles;
  let fixture: ComponentFixture<ChatBubbles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBubbles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBubbles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
