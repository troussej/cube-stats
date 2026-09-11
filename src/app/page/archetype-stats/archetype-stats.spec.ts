import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchetypeStats } from './archetype-stats';

describe('ArchetypeStats', () => {
  let component: ArchetypeStats;
  let fixture: ComponentFixture<ArchetypeStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchetypeStats],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchetypeStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
