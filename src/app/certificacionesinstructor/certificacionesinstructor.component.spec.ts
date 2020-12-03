import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificacionesinstructorComponent } from './certificacionesinstructor.component';

describe('CertificacionesinstructorComponent', () => {
  let component: CertificacionesinstructorComponent;
  let fixture: ComponentFixture<CertificacionesinstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificacionesinstructorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificacionesinstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
