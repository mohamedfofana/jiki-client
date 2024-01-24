import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BacklogsComponent } from "./backlogs.component";
import { AppConfigService } from 'src/app/core/config/appconfig-service';
import { SprintService } from 'src/app/core/services/database/sprint.service';
import { UserService } from 'src/app/core/services/database/user.service';
import { AuthService } from 'src/app/core/services/database/auth.service';
import { StorageService } from 'src/app/core/services/local/storage.service';

describe("BacklogsComponent", () => {
  let backlogsComponent: BacklogsComponent;
  let fixture: ComponentFixture<BacklogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppConfigService, SprintService, UserService, AuthService, StorageService ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklogsComponent);
    backlogsComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(backlogsComponent).toBeTruthy();
      expect(backlogsComponent.sprints.length).toBe(2);
    });
  });
})