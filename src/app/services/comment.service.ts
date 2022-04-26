import { StorageKeys } from 'src/app/enums/storage-keys.enum';
import { StorageUtil } from 'src/app/utils/storage.util';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestComment } from '../models/request-comment.model';

const {APIURL} = environment;


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private _token?: string = "";

  constructor(private readonly http: HttpClient) {
    this._token = StorageUtil.storageRead(StorageKeys.AuthKey);
   }


  //Save comment with requestId and comment
  public saveComment(requestId: number, comment: any): void {

    const headers = new HttpHeaders ({
      "Accept": "*/*",
      "Authorization": `Bearer ${this._token}`,
      "Content-Type": "application/json",
      })

      this.http.post(`${APIURL}request/${requestId}/comment/add`, JSON.stringify(comment), {headers}).
      subscribe({
        next: () => {
          console.log('comment succesfully saved')
        },
        error:(error: HttpErrorResponse) => {
          console.log(error.message);
        }
      })
  }

  //Get all comments of a requestId
  public getComments(requestId: number): Observable<RequestComment[]>{

    const headers = new HttpHeaders ({
      "Accept": "*/*",
      "Authorization": `Bearer ${this._token}`
      })

      return this.http.get<RequestComment[]>(`${APIURL}request/${requestId}/comment`, {headers})
  }
}
