import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeckTag } from './deck-tag';

describe('DeckTag', () => {
  let component: DeckTag;
  let fixture: ComponentFixture<DeckTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckTag],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckTag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
