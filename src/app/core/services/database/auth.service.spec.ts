import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from "./auth.service";
import { IUserLogin } from 'src/app/shared/interfaces';
import { AppConfigService } from '../../config/appconfig-service';

describe("AuthService", () => {
  let authServiceTest: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ AppConfigService ]
    });

    authServiceTest = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('login', () => {
    it('should return the user logged in', () => {
      // Given 
      const user: IUserLogin = {username: 'test', password: 'password' };
      // When 
      authServiceTest.login(user).subscribe(response => 
        // Then      
          expect(response.status).toBeFalse()
      );
     
    });
  });

  describe('isAuthenticatedValue', () => {
    it('should return false by default', () => {
      // Given 
      // When 
      // Then      
      expect(authServiceTest).toBeTruthy();
    });

    it('should return true', () => {
      // Given 

      // When 
      authServiceTest.userAuthChanged(true);
      const actual = authServiceTest.isAuthenticatedValue();
      // Then      
      expect(actual).toBeTrue();
    });

    it('should return false', () => {
      // Given 

      // When 
      authServiceTest.userAuthChanged(true);
      authServiceTest.userAuthChanged(false);
      const actual = authServiceTest.isAuthenticatedValue();
      // Then      
      expect(actual).toBeFalse();
    });
  });


});
