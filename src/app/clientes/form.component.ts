import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {
  public cliente: Cliente = new Cliente();
  public errores: String[] | undefined;

  protected titulo:string ="Crear cliente";
  constructor(private clienteService: ClienteService, 
    private router: Router,
    private activatedRoute: ActivatedRoute 
    ){
    }
    
  ngOnInit(){
    
    //Los metodos llamados aqui se ejecutan al cargar el componente
    //De esta forma al cargar el componente se llamara a este metodo. Comprobara que el id existe y cargara los datos del cliente
    this.cargarCliente();
  }
  public create(): void{
    //para añadir mas de una linea en el metodo añadimos las llaves {}
    this.clienteService.create(this.cliente)
    .subscribe(json => {
      this.router.navigate(['/clientes'])
      Swal.fire('Nuevo cliente',`Cliente ${json.cliente.nombre} creado con existo`, 'success');
    },
    err => {
      this.errores  = err.error.errors as string[];
      console.error('Codigo del error desde el status' + err.status);

      console.error(err.error.errors);
    } 
    );
  }

  cargarCliente(): void {
    
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      //comprobamos que el cliente existe
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    })
  }

  update():void{
    this.clienteService.update(this.cliente).subscribe(cliente => {
      this.router.navigate(['/clientes']);
      Swal.fire('Cliente actualizado',`Cliente ${this.cliente.nombre} actualizado con existo`, 'success');
    })
  }
  
}
