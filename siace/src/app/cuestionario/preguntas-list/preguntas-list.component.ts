import {
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Emprendedor } from '../../emprendedor/emprendedor';
import { EmprendedorService } from '../../emprendedor/emprendedor.service';
import {
  ConfirmacionComponent,
} from '../../encuestas/confirmacion/confirmacion.component';
import { LoginService } from '../../login/login.service';
import {
  BuscarContestacionesService,
} from '../../monitor/monitor.component.service';
import { CuestionarioService } from '../cuestionario.service';
import { Pregunta } from '../pregunta';
import { Respuesta } from '../respuesta';


interface ValorPonderadoPorPilar {
  prePilId: number;
  valorPonderado: number;
}
interface Acumulador {
  [key: number]: any; // Puedes reemplazar `any` con el tipo específico que esperas almacenar
}

@Component({
  selector: 'app-preguntas-list',
  templateUrl: './preguntas-list.component.html',
  styleUrl: './preguntas-list.component.css',
})
export class PreguntasListComponent implements OnInit {
  preguntas: Pregunta[] = [];
  preguntasVisibles: Pregunta[] = [];

  id: number = 0;
  pilaresExistentes: ValorPonderadoPorPilar[] = [];
  pilaresNameDos: any = [];
  valoresPonderadosPorPilar: ValorPonderadoPorPilar[] = [
    { prePilId: 1, valorPonderado: 1 },
    { prePilId: 2, valorPonderado: 1 },
    { prePilId: 3, valorPonderado: 1 },
  ];
  nombrePilares: string[] = [];
  pilarActualIndex: number = 0;
  resultados: any[] = [];
  promedioPilar: number = 0;

  constructor(
    private preguntaListService: CuestionarioService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private buscarContestacionesService: BuscarContestacionesService,
    private contestacionesService: BuscarContestacionesService,
    private emprendedorService: EmprendedorService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.loginService.clearAll();
    this.loadStateFromLocalStorage();
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id); // Aquí puedes usar el id para obtener las preguntas
      this.searchPreguntas(this.id);
    });
  }

  desactivarPreguntasHijas(pregunta: Pregunta): void {
    this.preguntasVisibles = this.preguntasVisibles.filter(
      (p) => p.prePreIdTrigger !== pregunta.preId
    );
  }

  direccionar() {
    this.guardar(1);
  }

  desactivarPreguntasHijass(pregunta: Pregunta): void {
    const preguntasHijas = this.preguntas.filter(
      (p) => p.prePreIdTrigger === pregunta.preId
    );

    preguntasHijas.forEach((preguntaHija) => {
      // Desactivar recursivamente las preguntas hijas
      this.desactivarPreguntasHijas(preguntaHija);
    });

    this.preguntasVisibles = this.preguntasVisibles.filter(
      (p) => p.prePreIdTrigger !== pregunta.preId
    );
  }

  encontrarResultados(idContestacion: number): void {
    this.contestacionesService.findResults(idContestacion).subscribe({
      next: (result) => {
        console.log('Resultados de busqueda:');
        console.log(result);
        this.resultados = result;
        this.calcularPromedio(idContestacion);
      },
      error: (error) => {
        console.log('error:');
        console.log(error);
      },
    });
  }

  calcularPromedio(idContestacion: number): void {
    if (this.resultados.length > 0) {
      const total = this.resultados.reduce(
        (sum, pilar) => sum + pilar.sumaPilar,
        0
      );
      this.promedioPilar = total / this.resultados.length;
      console.log('Este es tu promedio final');
      console.log(this.promedioPilar);
      const request = {
        promedio: this.promedioPilar,
        contestacionId: idContestacion,
      };
      this.preguntaListService.updateAverage(request).subscribe({
        next: (res) => {
          console.log(
            '-------------------------------Promedio guardado con exito-----------------------------'
          );
        },
        error: (error) => {},
      });
    }
  }

  guardar(tipoGuardado?: number) {
    // Filtrar contestaciones válidas de preguntas visibles
    const preguntasFiltro = this.preguntasVisibles.map((pregunta) => ({
      ...pregunta,
      contestaciones: pregunta.contestaciones.filter(
        (contestacion) => contestacion.corResId != 0
      ),
    }));

    // Recuperar información del localStorage
    const emprendedorString = localStorage.getItem('emprendedor');
    const fechaGuardadaString = localStorage.getItem('fechaActual');
    
    const rfcCurrent = localStorage.getItem('rfc');

    // Convertir la cadena de fecha a un objeto Date o asignar la fecha actual
    let fechaGuardada = new Date();
    if (fechaGuardadaString) {
      const parsedDate = new Date(fechaGuardadaString);
      if (!isNaN(parsedDate.getTime())) {
        fechaGuardada = parsedDate;
      }
    }

    if (!emprendedorString) {
      return;
    } 

    if (!rfcCurrent) {
      alert('No existe el RFC');
      return;
    }

    // Convertir la cadena JSON de emprendedor a un objeto
    const emprendedor: Emprendedor = JSON.parse(emprendedorString);

    console.log("Datos a enviar");
    console.log(rfcCurrent, emprendedor.empId, fechaGuardada);
    console.log("Datos a enviar sin parsear:");
    console.log(rfcCurrent, emprendedor.empId, fechaGuardadaString);
    
    


    // Crear contestación y guardar preguntas
    this.buscarContestacionesService
      .createContestacion(rfcCurrent, emprendedor.empId, fechaGuardada)
      .subscribe({
        next: (res) => {
          const idContestacion = res.id;
          this.preguntaListService
            .saveUpdateQuestions(preguntasFiltro, idContestacion)
            .subscribe({
              next: (result) => {
                this.encontrarResultados(result.result);

                // Agregar registro a EmprendedoresEtapa
                this.emprendedorService
                  .addEmprendedoresEtapa(1, emprendedor.empId, 1, 1)
                  .subscribe({
                    next: (res) => {
                      this.router.navigate([
                        `/cuestionario/${idContestacion}/result`,
                      ]);
                    },
                    error: (error) => {
                      alert('Error al guardar evidencia');
                    },
                  });
              },
              error: (error) => {
                // Manejo de error en la operación de guardado
              },
            });
        },
        error: (error) => {
          // Manejo de error al crear nueva contestación
        },
      });
  }

  irAPilarAnterior(): void {
    if (this.pilarActualIndex > 0) {
      this.pilarActualIndex--;
      // this.guardar();
      this.saveStateToLocalStorage();
      //this.searchPreguntas(this.id);
    }
  }

  irAPilarSiguiente(): void {
    ////MODIFICAR ESTA PARTE DEL CODIGO

    let currentPilar = this.pilaresNameDos[this.pilarActualIndex].prePilId ?? 0;

    const preguntasFiltroDos = this.preguntasVisibles
      .filter((pregunta) => {
        return pregunta.prePilId == currentPilar;
      })
      .map((pregunta) => {
        return {
          ...pregunta,
          contestaciones: pregunta.contestaciones.filter((contestacion) => {
            return contestacion.corResId != 0;
          }),
        };
      })
      .map((pregunta) => {
        return pregunta.preTipId != 3
          ? pregunta
          : {
              ...pregunta,
              contestaciones: pregunta.contestaciones.filter((contestacion) => {
                return contestacion.corResId == 1;
              }),
            };
      });
    let pasarSiguientePaso = true;
    preguntasFiltroDos.forEach((pregunta) => {
      console.log(pregunta.preObligatoria);
      console.log(pregunta.contestaciones);

      if (pregunta.preObligatoria && pregunta.contestaciones.length === 0) {
        ////En este punto, iluminar agregar una clase que haga que se ponga el asterisco en color rojo, de las preguntas no contestadas

        pasarSiguientePaso = false;
        return;
      }
    });
    if (!pasarSiguientePaso) {
      this.toastr.warning('Por favor responde las preguntas obligatorias.');
      return;
    }
    if (this.pilarActualIndex < this.pilaresNameDos.length - 1) {
      this.pilarActualIndex++;
      // this.guardar();
      this.saveStateToLocalStorage();
    } else {
      const preguntasFiltro = this.preguntasVisibles.map((pregunta) => {
        return {
          ...pregunta,
          contestaciones: pregunta.contestaciones.filter((contestacion) => {
            return contestacion.corResId != 0;
          }),
        };
      });

      console.log('Preguntas filtro: ');
      console.log(preguntasFiltro);

      const preguntasObligatoriasNoContestadas: string[] = [];

      preguntasFiltro.forEach((pregunta) => {
        console.log(pregunta.preObligatoria);
        console.log(pregunta.contestaciones);

        if (pregunta.preObligatoria && pregunta.contestaciones.length === 0) {
          ////En este punto, iluminar agregar una clase que haga que se ponga el asterisco en color rojo, de las preguntas no contestadas
          preguntasObligatoriasNoContestadas.push(pregunta.prePregunta);
          this.toastr.error(
            'Por favor responde las preguntas obligatorias.',
            'Error'
          );
          return;
        }
      });

      if (preguntasObligatoriasNoContestadas.length > 0) {
        return;
      }
   
      const confirmaDialog = this.dialog.open(ConfirmacionComponent, {
        data: {
          titulo: 'Confirmación',
          mensaje: '¿Está seguro que deseas generar el reporte de tu encuesta?',
        },
        height: '200px',
        width: '450px',
        minWidth: '500px',
        maxWidth: '450px',
      });

      confirmaDialog.afterClosed().subscribe((result) => {
        if (result) {
          this.guardar(1);
        }
      });
    }
  }

  loadStateFromLocalStorage() {
    const savedState = localStorage.getItem('preguntasState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.preguntas = state.preguntas || [];
      this.preguntasVisibles = state.preguntasVisibles || [];
      this.valoresPonderadosPorPilar = state.valoresPonderadosPorPilar || [];
      this.pilarActualIndex = 0;
      this.pilaresNameDos = state.pilaresNameDos || [];
    }
  }

  nuevaEncuesta() {
    this.router.navigate(['/cuestionario/0']);
  }

  onRespuestaSeleccionada(pregunta: Pregunta, respuesta: Respuesta): void {
    const getCorId = pregunta.contestaciones[0].corId ?? 0;

    // Desactivar las preguntas hijas de la pregunta actual antes de actualizar la respuesta seleccionada
    this.desactivarPreguntasHijass(pregunta);
    console.log('Pregunta a actualizar: ');
    console.log(pregunta);

    // Actualizar las respuestas seleccionadas
    pregunta.respuesta.forEach((res) => (res.seleccionado = res === respuesta));

    // Actualizar las contestaciones según las respuestas seleccionadas
    pregunta.contestaciones = pregunta.contestaciones.filter(
      (cont) => cont.corPreId !== pregunta.preId
    );

    pregunta.contestaciones.push({
      corId: getCorId,
      corResId: respuesta.resId,
      corPreId: pregunta.preId,
      corValor: respuesta.resValor,
      corImagen: '',
      corNoContesto: false,
    });

    // Encontrar preguntas que serán agregadas
    const nuevasPreguntas = this.preguntas.filter(
      (p) =>
        p.prePreIdTrigger === pregunta.preId &&
        p.preResIdTrigger === respuesta.resId
    );

    // Encontrar el índice de la pregunta actual, seleccionada
    const index = this.preguntasVisibles.indexOf(pregunta) + 1;

    // Insertar las nuevas preguntas después del índice de la pregunta actual
    for (const nuevaPregunta of nuevasPreguntas) {
      if (!this.preguntasVisibles.includes(nuevaPregunta)) {
        this.preguntasVisibles.splice(index, 0, nuevaPregunta);
      }
    }
    const limpiezaPreguntas = this.preguntas.map((preguntaActual) => {
      return preguntaActual.preTipId != 5
        ? preguntaActual
        : {
            ...preguntaActual,
            contestaciones: preguntaActual.contestaciones.filter(
              (contestacion) => {
                return contestacion.corResId != 0;
              }
            ),
          };
    });
    console.log('Limpieza de preguntas: ');
    console.log(limpiezaPreguntas);

    const preguntasFinal = limpiezaPreguntas.map((preguntaActual) => {
      return preguntaActual.preId != pregunta.preId
        ? preguntaActual
        : {
            ...preguntaActual,
            contestaciones:
              preguntaActual.preId == 5
                ? [
                    ...pregunta.contestaciones,
                    {
                      corId: getCorId, // Asigna un ID si es necesario
                      corResId: respuesta.resId,
                      corPreId: pregunta.preId,
                      corValor: respuesta.resValor,
                      corImagen: '', // Asigna una imagen si es necesario
                      corNoContesto: false,
                    },
                  ]
                : [
                    {
                      corId: getCorId, // Asigna un ID si es necesario
                      corResId: respuesta.resId,
                      corPreId: pregunta.preId,
                      corValor: respuesta.resValor,
                      corImagen: '', // Asigna una imagen si es necesario
                      corNoContesto: false,
                    },
                  ],
          };
    });
    this.preguntas = preguntasFinal;
    console.log('Valor de preguntas final:');
    console.log(preguntasFinal);
  }

  onCheckboxRespuestaSeleccionada(
    pregunta: Pregunta,
    respuesta: Respuesta
  ): void {
    // Alternar la selección de la respuesta
    respuesta.seleccionado = !respuesta.seleccionado;

    if (respuesta.seleccionado) {
      // Añadir nueva contestación con corId inicializado en cero
      pregunta.contestaciones = pregunta.contestaciones.filter((pregunta) => {
        return pregunta.corResId != 0;
      });
      pregunta.contestaciones.push({
        corId: 0, // Inicializa corId en cero para nuevas contestaciones
        corResId: respuesta.resId,
        corPreId: pregunta.preId,
        corValor: respuesta.resValor,
        corImagen: '', // Asigna una imagen si es necesario
        corNoContesto: false,
      });
    } else {
      // Eliminar contestación existente si se deselecciona
      pregunta.contestaciones = pregunta.contestaciones.filter(
        (cont) =>
          !(
            cont.corResId === respuesta.resId &&
            cont.corPreId === pregunta.preId
          )
      );
      if (pregunta.contestaciones.length == 0) {
        pregunta.contestaciones.push({
          corId: 0,
          corResId: 0, // Ajusta esto según sea necesario
          corPreId: pregunta.preId,
          corValor: '',
          corImagen: '',
          corNoContesto: false,
        });
      }
    }

    // Encontrar preguntas que serán agregadas
    const nuevasPreguntas = this.preguntas.filter(
      (p) =>
        p.prePreIdTrigger === pregunta.preId &&
        p.preResIdTrigger === respuesta.resId
    );

    // Encontrar el índice de la pregunta actual, seleccionada
    const index = this.preguntasVisibles.indexOf(pregunta) + 1;

    // Insertar las nuevas preguntas después del índice de la pregunta actual
    for (const nuevaPregunta of nuevasPreguntas) {
      if (!this.preguntasVisibles.includes(nuevaPregunta)) {
        this.preguntasVisibles.splice(index, 0, nuevaPregunta);
      }
    }

    // Recalcular los valores ponderados
  }

  onRespuestaTextoCambiado(pregunta: Pregunta, event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    const getCorId = pregunta.contestaciones[0].corId ?? 0;

    pregunta.contestaciones[0] = {
      corId: getCorId,
      corResId: 1,
      corPreId: pregunta.preId,
      corValor: inputElement.value,
      corImagen: '',
      corNoContesto: false,
    };
  }

  obtenerPreguntasDelPilarActual(): Pregunta[] {
    const pilarActual = this.pilaresNameDos[this.pilarActualIndex];
    console.log('Obtener preguntas pilar actual');
    console.log(this.preguntasVisibles);

    console.log('PREGUNTAS QUE SERAN FILTRADAS');
    console.log(
      this.preguntasVisibles.filter(
        (pregunta) => pregunta.prePilId === pilarActual.prePilId
      )
    );

    return this.preguntasVisibles.filter(
      (pregunta) => pregunta.prePilId === pilarActual.prePilId
    );
  }

  saveStateToLocalStorage() {
    const state = {
      preguntas: this.preguntas,
      preguntasVisibles: this.preguntasVisibles,
      valoresPonderadosPorPilar: this.valoresPonderadosPorPilar,
      pilarActualIndex: this.pilarActualIndex,
      valoresPilar: this.pilaresNameDos,
    };

    localStorage.setItem('preguntasState', JSON.stringify(state));
  }

  searchPreguntas(idContestacion: number) {
    this.preguntaListService.searchPreguntas(idContestacion).subscribe({
      next: (response) => {
        console.log('Se muestra el resultado de las preguntas');
        console.log(response);

        this.preguntas = response.map((pregunta) => ({
          ...pregunta,
          contestaciones:
            pregunta.contestaciones.length > 0
              ? pregunta.contestaciones
              : [
                  {
                    corId: 0,
                    corResId: 0, // Ajusta esto según sea necesario
                    corPreId: pregunta.preId,
                    corValor: '',
                    corImagen: '',
                    corNoContesto: false,
                  },
                ],
        }));
        console.log('Preguntas completasSSS');
        console.log(this.preguntas);

        this.preguntas.forEach((pregunta) => {
          pregunta.respuesta.forEach((res) => {
            res.seleccionado = pregunta.contestaciones.some(
              (cont) =>
                cont.corResId === res.resId && cont.corPreId === pregunta.preId
            );

            if (pregunta.preTipId === 3) {
              // Para preguntas abiertas, asignar el valor de la contestación
              const contestacion = pregunta.contestaciones.find(
                (cont) => cont.corPreId === pregunta.preId
              );
              if (contestacion) {
                res.resValor = contestacion.corValor;
              }
            }
          });
        });
        console.log('ASí queden preguntassss');
        console.log(this.preguntas);

        // Crear el mapeo de preguntas normales
        const preguntasMap = new Map<number, Pregunta[]>();
        this.preguntas.forEach((pregunta) => {
          if (!pregunta.prePreIdTrigger && !pregunta.preResIdTrigger) {
            if (!preguntasMap.has(pregunta.preId)) {
              preguntasMap.set(pregunta.preId, []);
            }
            preguntasMap.get(pregunta.preId)!.push(pregunta);
          }
        });

        console.log('Preguntas map');
        console.log(preguntasMap);

        // Agregar preguntas hijas al mapeo
        this.preguntas.forEach((pregunta) => {
          if (pregunta.prePreIdTrigger && pregunta.preResIdTrigger) {
            const padre = this.preguntas.find(
              (p) => p.preId === pregunta.prePreIdTrigger
            );
            if (
              padre &&
              padre.contestaciones.some(
                (cont) =>
                  cont.corPreId === pregunta.prePreIdTrigger &&
                  cont.corResId === pregunta.preResIdTrigger
              )
            ) {
              if (!preguntasMap.has(padre.preId)) {
                preguntasMap.set(padre.preId, []);
              }
              preguntasMap.get(padre.preId)!.push(pregunta);
            }
          }
        });

        console.log('MAPEO:::');
        console.log(preguntasMap);

        // Convertir el mapeo en un array ordenado de preguntas visibles
        this.preguntasVisibles = [];
        preguntasMap.forEach((preguntas) => {
          this.preguntasVisibles.push(...preguntas);
        });

        console.log(this.preguntasVisibles);

        console.log('PILARES:');
        let pilaresVisibles = this.preguntasVisibles.reduce<Acumulador>(
          (acumulador, elementoActual) => {
            if (!acumulador[elementoActual.prePilId]) {
              elementoActual.pildDescription;
              acumulador[elementoActual.prePilId] = elementoActual.prePilId;
            }

            return acumulador;
          },
          {}
        );

        this.nombrePilares = this.preguntasVisibles.reduce<string[]>(
          (acumulador, elementoActual) => {
            if (!acumulador.includes(elementoActual.pildDescription)) {
              acumulador.push(elementoActual.pildDescription);
            }
            return acumulador;
          },
          []
        );
        this.pilaresNameDos = this.preguntasVisibles.reduce<any>(
          (acumulador, elementoActual) => {
            // Verifica si ya existe un elemento con el mismo prePilId y pildDescription
            if (
              !acumulador.some(
                (item: { prePilId: number; pildDescription: string }) =>
                  item.prePilId === elementoActual.prePilId &&
                  item.pildDescription === elementoActual.pildDescription
              )
            ) {
              acumulador.push({
                prePilId: elementoActual.prePilId,
                pildDescription: elementoActual.pildDescription,
              });
            }
            return acumulador;
          },
          []
        );
        console.log('Pilares dos, ordenado ');
        console.log(this.pilaresNameDos);

        console.log('PILARES VISIBLES');
        console.log(pilaresVisibles);
        console.log('Nombre de pilares: ');
        console.log(this.nombrePilares);

        this.valoresPonderadosPorPilar = Object.entries(pilaresVisibles).map(
          ([key, value]) => ({
            prePilId: Number(key),
            valorPonderado: value as number,
          })
        );
      },
      error: (error) => {
        console.log('error al ejecutar la respuesta');
        console.log(error);
      },
    });
  }
}
