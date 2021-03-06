import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/models/user.model';
import { StorageUtil } from 'src/app/utils/storage.util';
import { StorageKeys } from 'src/app/enums/storage-keys.enum';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent {

  public error: boolean = false;

  @Output() login: EventEmitter<void> = new EventEmitter();

  constructor( 
    private readonly loginService: LoginService,
    private readonly userService: UserService,
    ) { }

  public togglePassword(): void {
    let p = <HTMLInputElement>document.getElementById("password");
    if (p.type === "password") {
      p.type = "text";
    } else {
      p.type = "password";
    }
  }

  public loginSubmit(loginForm: NgForm): void {
    const { username } = loginForm.value;
    const { password } = loginForm.value;

    //-- First store the master token in de session storage
    this.loginService.getMasterToken();

    //-- Then login
    this.loginService.loginKeyCloak(username, password)
      .subscribe ({
        next: (result) => {
          //-- Get the employee from the database
          this.loginService.getEmployeeByIdAPI(result.decodedToken.sub, result.access_token)

          //-- Define the logged in employee
          this.userService.user = {
            id: result.decodedToken.sub,
            username: result.decodedToken.preferred_username,
            email: result.decodedToken.email
        }

        //-- Navigate to the calendar page and store they the employee and the key in sessionstorage
        StorageUtil.storageSave<User>(StorageKeys.User, this.userService.user)
        StorageUtil.storageSave<string>(StorageKeys.UserId, this.userService.user.id)
        StorageUtil.storageSave(StorageKeys.AuthKey, result.access_token)
        
        this.login.emit();

        },
        error: (error) => {
          this.error = true;
        }
      })
  }
}