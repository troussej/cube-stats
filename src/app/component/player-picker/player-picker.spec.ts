import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerPicker } from './player-picker';

describe('PlayerPicker', () => {
  let component: PlayerPicker;
  let fixture: ComponentFixture<PlayerPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
