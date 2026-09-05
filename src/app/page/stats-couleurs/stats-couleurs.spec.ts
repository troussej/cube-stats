import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsCouleurs } from './stats-couleurs';

describe('StatsCouleurs', () => {
  let component: StatsCouleurs;
  let fixture: ComponentFixture<StatsCouleurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsCouleurs],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCouleurs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
