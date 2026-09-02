import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EloChange } from './elo-change';

describe('EloChange', () => {
  let component: EloChange;
  let fixture: ComponentFixture<EloChange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EloChange],
    }).compileComponents();

    fixture = TestBed.createComponent(EloChange);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
