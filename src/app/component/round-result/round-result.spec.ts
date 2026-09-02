import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoundResult } from './round-result';

describe('RoundResult', () => {
  let component: RoundResult;
  let fixture: ComponentFixture<RoundResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundResult],
    }).compileComponents();

    fixture = TestBed.createComponent(RoundResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
