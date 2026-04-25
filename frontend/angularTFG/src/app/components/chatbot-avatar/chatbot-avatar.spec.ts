import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotAvatar } from './chatbot-avatar';

describe('ChatbotAvatar', () => {
  let component: ChatbotAvatar;
  let fixture: ComponentFixture<ChatbotAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotAvatar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotAvatar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
