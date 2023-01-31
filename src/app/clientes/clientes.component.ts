import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import {Cliente} from './cliente';
import { ClienteService } from './cliente.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})

export class ClientesComponent {
  constructor(private clienteService: ClienteService){}

  clientes: Cliente[]=[]
  
  ngOnInit(){
    //peticon sincrono
    //this.clientes = this.clienteService.getClientes();

    //peticion asincrona
    this.clienteService.getClientes().subscribe(
      clientes => this.clientes = clientes
    );

    //Notas sobre el Stream
    //clientes es el resultado del Stream
    //asignamos a this.clientes el resultado del Stream
    //es lo mismo que esto
    // funcion (clientes){
    // this.clientes = clientes
    //}

    //Para pasar mas de un argumento 
    //(clientes, palos) => this.clientes = clientes
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Estas seguro?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            //quitamos el cliente de la lista
            this.clientes = this.clientes.filter(cli =>cli !== cliente)

            //mensaje OK
            Swal.fire('Cliente eliminado!', '', 'success')
          }
        )
        
      } 
    })
  }
}
