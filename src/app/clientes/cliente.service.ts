import { Injectable } from '@angular/core';
import { CLIENTES } from './cliente json';
import {Cliente} from './cliente';

// Para crear peticiones asincronas con flujos de datos (Stream) importamos Observable y of
import { map, Observable, catchError, throwError } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8080/api/clientes' ;
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'})
  
  constructor(private http: HttpClient, private router: Router) { }
  getClientes(): Observable <Cliente[]>{
    //Dos formas de hacerlo
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe(
      map(response => {
        //Sin formatear el codigo seria asi:
        //response => response as Cliente[];
        let clientes = response as Cliente[];

        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();//pasar a mayusculas
          cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
          return cliente;
        });
      })
    )
  }
  //Retorna un objeto observable de tipo cliente del api rest
  //Le pasamos la URl, el objeto cliente y las cabeceras
  create(cliente: Cliente) : Observable<any>{
    return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.
    httpHeaders}).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(() => new Error(e));
        }
        console.error(e.error.mensaje);
        Swal.fire('Error al editar' + cliente.apellido ,e.error.mensaje, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  //constructor() { }
  //Metodo asincrono (estatico con datos de prueba)
  //getClientes(): Observable <Cliente[]>{return of(CLIENTES);}


  //Normal siendo sincrono
  //getClientes(): Cliente[]{return CLIENTES;}

  getCliente(id:number) : Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']); 
        console.error(e.error.mensaje);
        Swal.fire('Error al editar',e.error.mensaje, 'error');
        return throwError(() => new Error(e));

      })
    )

    //caso de error
  }

  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders});
  }

  delete(id:number):Observable<Cliente>{
    console.log(`${this.urlEndPoint}/${id}`)
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders});
  }
}
