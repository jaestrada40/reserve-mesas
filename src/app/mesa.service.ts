import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Asiento {
  id: number;
  seleccionado: boolean;
}

export interface Mesa {
  id: number;
  asientos: Asiento[];
  seleccionada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private readonly STORAGE_KEY = 'mesas'; // Clave para almacenar en localStorage
  private mesasSubject: BehaviorSubject<Mesa[]> = new BehaviorSubject<Mesa[]>([]);
  mesas$: Observable<Mesa[]> = this.mesasSubject.asObservable();

  constructor() {
    const mesasGuardadas = localStorage.getItem(this.STORAGE_KEY);
    if (mesasGuardadas) {
      try {
        const mesasParseadas: Mesa[] = JSON.parse(mesasGuardadas);
        // Validar que los datos sean del formato esperado
        if (Array.isArray(mesasParseadas)) {
          this.mesasSubject.next(mesasParseadas);
        } else {
          this.inicializarMesas();
        }
      } catch (error) {
        console.error('Error al parsear mesas desde localStorage:', error);
        this.inicializarMesas();
      }
    } else {
      this.inicializarMesas();
    }

    // Suscribirse a cambios y actualizar localStorage automáticamente
    this.mesas$.subscribe(mesas => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mesas));
    });
  }

  /**
   * Inicializa las mesas con valores predeterminados.
   */
  private inicializarMesas(): void {
    const mesasIniciales: Mesa[] = [];
    for (let i = 1; i <= 4; i++) {
      mesasIniciales.push({
        id: i,
        asientos: this.crearAsientos(4),
        seleccionada: false
      });
    }
    this.mesasSubject.next(mesasIniciales);
  }

  /**
   * Crea un arreglo de asientos.
   * @param numero Número de asientos a crear.
   * @returns Arreglo de objetos Asiento.
   */
  private crearAsientos(numero: number): Asiento[] {
    const asientos: Asiento[] = [];
    for (let i = 1; i <= numero; i++) {
      asientos.push({ id: i, seleccionado: false });
    }
    return asientos;
  }

  /**
   * Agrega una nueva mesa con un número específico de asientos.
   * @param numeroAsientos Número de asientos para la nueva mesa.
   */
  agregarMesa(numeroAsientos: number = 4): void {
    const mesas = this.mesasSubject.getValue();
    const nuevoId = mesas.length > 0 ? Math.max(...mesas.map(m => m.id)) + 1 : 1;
    mesas.push({
      id: nuevoId,
      asientos: this.crearAsientos(numeroAsientos),
      seleccionada: false
    });
    this.mesasSubject.next(mesas);
  }

  /**
   * Elimina una mesa por su ID.
   * @param id ID de la mesa a eliminar.
   */
  eliminarMesa(id: number): void {
    let mesas = this.mesasSubject.getValue();
    mesas = mesas.filter(m => m.id !== id);
    this.mesasSubject.next(mesas);
  }

  /**
   * Agrega un asiento a una mesa específica.
   * @param idMesa ID de la mesa a la que se agregará el asiento.
   */
  agregarAsiento(idMesa: number): void {
    const mesas = this.mesasSubject.getValue();
    const mesa = mesas.find(m => m.id === idMesa);
    if (mesa) {
      const nuevoAsientoId = mesa.asientos.length > 0 ? Math.max(...mesa.asientos.map(a => a.id)) + 1 : 1;
      mesa.asientos.push({ id: nuevoAsientoId, seleccionado: false });
      this.mesasSubject.next(mesas);
    }
  }

  /**
   * Elimina un asiento específico de una mesa.
   * @param idMesa ID de la mesa de la cual se eliminará el asiento.
   * @param idAsiento ID del asiento a eliminar.
   */
  eliminarAsiento(idMesa: number, idAsiento: number): void {
    const mesas = this.mesasSubject.getValue();
    const mesa = mesas.find(m => m.id === idMesa);
    if (mesa) {
      mesa.asientos = mesa.asientos.filter(a => a.id !== idAsiento);
      // Actualizar el estado de la mesa si es necesario
      mesa.seleccionada = mesa.asientos.length > 0 && mesa.asientos.every(a => a.seleccionado);
      this.mesasSubject.next(mesas);
    }
  }

  /**
   * Selecciona o deselecciona una mesa completa.
   * @param mesa Mesa a seleccionar o deseleccionar.
   */
  seleccionarMesa(mesa: Mesa): void {
    mesa.seleccionada = !mesa.seleccionada;
    mesa.asientos.forEach(asiento => asiento.seleccionado = mesa.seleccionada);
    this.mesasSubject.next(this.mesasSubject.getValue());
  }

  /**
   * Selecciona o deselecciona un asiento específico.
   * @param mesa Mesa a la que pertenece el asiento.
   * @param asiento Asiento a seleccionar o deseleccionar.
   */
  seleccionarAsiento(mesa: Mesa, asiento: Asiento): void {
    asiento.seleccionado = !asiento.seleccionado;
    mesa.seleccionada = mesa.asientos.every(a => a.seleccionado);
    this.mesasSubject.next(this.mesasSubject.getValue());
  }

  /**
   * Obtiene el estado de una mesa.
   * @param mesa Mesa de la cual se desea conocer el estado.
   * @returns Estado de la mesa como cadena de texto.
   */
  obtenerEstadoMesa(mesa: Mesa): string {
    if (mesa.seleccionada) {
      return 'Seleccionada';
    } else if (mesa.asientos.some(a => a.seleccionado)) {
      return 'Parcialmente seleccionada';
    } else {
      return 'Disponible';
    }
  }
}
