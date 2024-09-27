import { Component, OnInit } from '@angular/core';
import { MesaService, Mesa, Asiento } from '../mesa.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  mesas$: Observable<Mesa[]>;

  constructor(private mesaService: MesaService) {
    this.mesas$ = this.mesaService.mesas$;
  }

  ngOnInit(): void {}

  seleccionarMesa(mesa: Mesa): void {
    this.mesaService.seleccionarMesa(mesa);
  }

  seleccionarAsiento(mesa: Mesa, asiento: Asiento): void {
    this.mesaService.seleccionarAsiento(mesa, asiento);
  }

  obtenerEstadoMesa(mesa: Mesa): string {
    return this.mesaService.obtenerEstadoMesa(mesa);
  }

  // Métodos para el dueño del restaurante
  agregarMesa(numeroAsientos: number): void {
    this.mesaService.agregarMesa(numeroAsientos);
  }

  agregarAsiento(idMesa: number): void {
    this.mesaService.agregarAsiento(idMesa);
  }

  eliminarMesa(idMesa: number): void {
    this.mesaService.eliminarMesa(idMesa);
  }

  eliminarAsiento(idMesa: number, idAsiento: number): void {
    this.mesaService.eliminarAsiento(idMesa, idAsiento);
  }
}
