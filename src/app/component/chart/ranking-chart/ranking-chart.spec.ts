import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingChart } from './ranking-chart';

describe('RankingChart', () => {
  let component: RankingChart;
  let fixture: ComponentFixture<RankingChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingChart],
    }).compileComponents();

    fixture = TestBed.createComponent(RankingChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
