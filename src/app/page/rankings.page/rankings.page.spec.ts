import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingsPage } from './rankings.page';

describe('RankingsPage', () => {
  let component: RankingsPage;
  let fixture: ComponentFixture<RankingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RankingsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
