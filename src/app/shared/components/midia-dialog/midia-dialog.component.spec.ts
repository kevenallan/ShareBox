import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiaDialogComponent } from './midia-dialog.component';

describe('MidiaDialogComponent', () => {
  let component: MidiaDialogComponent;
  let fixture: ComponentFixture<MidiaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MidiaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidiaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
