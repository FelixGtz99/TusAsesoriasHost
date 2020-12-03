import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminreportComponent } from './adminreport.component';

describe('AdminreportComponent', () => {
  let component: AdminreportComponent;
  let fixture: ComponentFixture<AdminreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
