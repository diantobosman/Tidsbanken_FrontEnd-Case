import { Employee } from 'src/app/models/employee.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageKeys } from '../enums/storage-keys.enum';
import { Vacation } from '../models/vacation.model';
import { StorageUtil } from '../utils/storage.util';
import { CommentService } from './comment.service';
import { EmployeeService } from './employee.service';
import { DatePipe } from '@angular/common';

const {APIURL} = environment;


@Injectable({
  providedIn: 'root'
})

export class VacationService {

  private _vacationById!: Vacation;
  private _loading: boolean = false;
  private _vacations: Vacation[] = [];
  private _events: Vacation[] = [];
  private _ownVacations: Vacation[] = [];
  private _error: any = '';
  private _savedVacation!: any;
  private _updatedVacation!: Vacation;
  private _token: string = "";
  private _employeeId?: string = "";
  
  constructor(
    private readonly http: HttpClient, 
    private readonly commentService: CommentService,
    private readonly employeeService: EmployeeService,
    private datePipe: DatePipe) {
      this._token = StorageUtil.storageRead(StorageKeys.AuthKey)!;
      this._employeeId = StorageUtil.storageRead(StorageKeys.UserId);
    }

  get vacations (){
    return this._vacations;
  }

  get events (){
    return this._events;
  }

  get ownVacations (){
    return this._ownVacations;
  }

  get vacationById (){
    return this._vacationById;
  }

  get loading (){
    return this._loading;
  }

  get error() {
    return this._error;
  }

  get savedVacation(){
    return this._savedVacation;
  }

  // Fetch all vacations
  public getAllVacations() : void {

    this._loading = true;
    const headers = new HttpHeaders ({
      "Accept": "*/*",
      "Authorization": `Bearer ${this._token}`
      })

    this.http.get<Vacation[]>(`${APIURL}vacation_request/`, {headers})
    .pipe(
        finalize(() => this._loading = false)
      )
      .subscribe({
        next: (vacations: Vacation[]) => {
          this._vacations = [];
          vacations.forEach((vacation: any) => {
            this.employeeService.getEmployeeById(vacation.requestOwner.toString(), this._token).subscribe(
              employee =>{
                vacation.requestOwner = employee;
              }
            )
            if(vacation.moderator !== null){
              this.employeeService.getEmployeeById(vacation.moderator.toString(), this._token).subscribe(
                employee =>{
                  vacation.moderator = employee;
                }
              )
            }
            this.commentService.getComments(vacation.requestId, this._token).subscribe(
              comments =>{
                vacation.comment = comments
              }
            )
            vacation.periodStart = this.datePipe.transform(vacation.periodStart, 'dd-MM-yyyy');
            vacation.periodEnd = this.datePipe.transform(vacation.periodEnd, 'dd-MM-yyyy');
            this._vacations.push(vacation);
          })
      }
    })
  }

   // Fetch all vacations for calendar
   public getAllCalendarEvents() : void {

    this._loading = true;
    const headers = new HttpHeaders ({
      "Accept": "*/*",
      "Authorization": `Bearer ${this._token}`
      })

    this.http.get<Vacation[]>(`${APIURL}vacation_request/`, {headers})
    .pipe(
        finalize(() => this._loading = false)
      )
      .subscribe({
        next: (vacations: Vacation[]) => {
          this._events = [];
          vacations.forEach((vacation: Vacation) => {
            this.employeeService.getEmployeeById(vacation.requestOwner.toString(), this._token).subscribe(
              employee =>{
                vacation.requestOwner = employee;
              }
            )
            if(vacation.moderator !== null){
              this.employeeService.getEmployeeById(vacation.moderator.toString(), this._token).subscribe(
                employee =>{
                  vacation.moderator = employee;
                }
              )
            }
            this.commentService.getComments(vacation.requestId, this._token).subscribe(
              comments =>{
                vacation.comment = comments
              }
            )
            this._events.push(vacation);
          })
      }
    })
  }

  // Fetch all vacations of an employee
  public getVacationByEmployeeId(): void{

    const headers = new HttpHeaders ({
      "Accept": "*/*",
      "Authorization": `Bearer ${this._token}`
      })

      this._loading = true;

      this.http.get<Vacation[]>(`${APIURL}employee/${this._employeeId}/requests?limit=50`, {headers})
      .pipe(
        finalize(() => this._loading = false)
      )
      .subscribe({
        next: (vacations: Vacation[]) => {
          this._ownVacations = [];
          vacations.forEach((vacation: any) => {
            this.employeeService.getEmployeeById(vacation.requestOwner.toString(), this._token).subscribe(
              employee =>{
                vacation.requestOwner = employee;
              }
            )
            if(vacation.moderator !== null){
              this.employeeService.getEmployeeById(vacation.moderator.toString(), this._token).subscribe(
                employee =>{
                  vacation.moderator = employee;
                }
              )
            }
            this.commentService.getComments(vacation.requestId, this._token).subscribe(
              comments =>{
                vacation.comment = comments
              }
            )
            vacation.periodStart = this.datePipe.transform(vacation.periodStart, 'dd-MM-yyyy');
            vacation.periodEnd = this.datePipe.transform(vacation.periodEnd, 'dd-MM-yyyy');
            this._ownVacations.push(vacation);
          })
        }
      })
  }

  // Fetch the vacations by vacationId
  public getVacationByID(vacationId: number): void {

    if(this._loading){
      return
    }

    const headers = new HttpHeaders ({
      "Accept": "*/*",
      "Authorization": `Bearer ${this._token}`
      })

    this._loading = true;

    this.http.get<Vacation>(`${APIURL}vacation_request/${vacationId}`, {headers})
    .pipe(
      map((response: any) => response),
      finalize(() => this._loading = false)
    )
    .subscribe({
        next: (vacation: Vacation) =>{
            this.employeeService.getEmployeeById(vacation.requestOwner.toString(), this._token).subscribe(
              employee =>{
                vacation.requestOwner = employee;
              }
            )
            if(vacation.moderator !== null){
              this.employeeService.getEmployeeById(vacation.moderator.toString(), this._token).subscribe(
                employee =>{
                  vacation.moderator = employee;
                }
              )
            }
          this._vacationById = vacation;
        },
        error:(error: HttpErrorResponse) => {
          this._error = error.message;
        }
      }
    )
  }

  //Save a new vacation request to the database
  public saveNewVacation(vacation: any): void {

    this._loading = true;

    const headers = new HttpHeaders ({
      "Accept": "*/*",
      "Authorization": `Bearer ${this._token}`,
      "Content-Type": "application/json",
      })

    const comment = {
        message: vacation.comments
      }

     this.http.post<Vacation>(`${APIURL}vacation_request/create`, JSON.stringify(vacation), {headers})
     .pipe(
      finalize(() => this._loading = false)
     )
     .subscribe({
      next: (response: any) => {
        if(comment.message.length > 0){
          this.commentService.saveComment(response.requestId, comment, this._token);
        }
        this.employeeService.getEmployeeById(response.requestOwner.toString(), this._token).subscribe(
          employee =>{
            response.requestOwner = employee;
          }
        )
        this.commentService.getComments(response.requestId, this._token).subscribe(
          comments =>{
            response.comment = comments
          }
        )
        response.periodStart = this.datePipe.transform(response.periodStart, 'dd-MM-yyyy');
        response.periodEnd = this.datePipe.transform(response.periodEnd, 'dd-MM-yyyy');
        this._savedVacation = response;
      },
      error:(error: HttpErrorResponse) => {
        this._error = error.message;
      }
    })
  }

    //Update vacation request to the database
    public updateVacation(vacation: any, commentMessage: string): void {

      this._loading = true;
  
      const headers = new HttpHeaders ({
        "Accept": "*/*",
        "Authorization": `Bearer ${this._token}`,
        "Content-Type": "application/json",
        })
  
      const comment = {
          message: commentMessage
        }
  
       this.http.patch<Vacation>(`${APIURL}vacation_request/update/${vacation.requestId}`, JSON.stringify(vacation), {headers})
       .pipe(
         finalize(() => this._loading = false)
       )
       .subscribe({
        next: (response: Vacation) => {
          console.log(comment);
          if(comment.message.length > 0){
            this.commentService.saveComment(vacation.requestId, comment, this._token)
          }
          this._updatedVacation = response;
        },
        error:(error: HttpErrorResponse) => {
          this._error = error.message;
        }
      })
    }

  // Delete vacation by id
  public deleteVacationById(vacationId: number): any {

    const headers = new HttpHeaders ({
      "Accept": "*/*",
      "Authorization": `Bearer ${this._token}`
      })

    return this.http.delete<string>(`${APIURL}vacation_request/delete/${vacationId}`, {headers});
  }
}
