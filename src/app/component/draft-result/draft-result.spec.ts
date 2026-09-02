import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraftResult } from './draft-result';

describe('DraftResult', () => {
  let component: DraftResult;
  let fixture: ComponentFixture<DraftResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftResult],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
