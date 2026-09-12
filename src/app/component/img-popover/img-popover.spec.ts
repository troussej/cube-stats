import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImgPopover } from './img-popover';

describe('ImgPopover', () => {
  let component: ImgPopover;
  let fixture: ComponentFixture<ImgPopover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgPopover],
    }).compileComponents();

    fixture = TestBed.createComponent(ImgPopover);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
