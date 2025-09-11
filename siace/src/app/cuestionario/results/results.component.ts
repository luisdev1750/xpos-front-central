import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CuestionarioService } from '../cuestionario.service';
import { Pregunta } from '../pregunta';
import { Contestacion } from '../contestacion';
import { BuscarContestacionesService } from '../../monitor/monitor.component.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../login/login.service';

interface ValorPonderadoPorPilar {
  prePilId: number;
  valorPonderado: number;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  grupos: any[] = [];
  preguntas: Pregunta[] = [];
  preguntasVisibles: Pregunta[] = [];
  valoresPonderadosPorPilar: ValorPonderadoPorPilar[] = [];
  pilarActualIndex: number = 0;
  pilarFinal: number = 0;
  id: string = '';
  resultados: any[] = [];
  promedioPilar: number = 0;

  constructor(
    private preguntaListService: CuestionarioService,
    private router: Router,
    private route: ActivatedRoute,
    private contestacionesService: BuscarContestacionesService,
    private toastr: ToastrService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.loginService.clearAll();
    this.id = this.route.snapshot.paramMap.get('id') ?? '0';
    console.log('SE MUESTRA EL ID DE ENCUESTA');
    console.log(this.id);

    this.searchPreguntas();
    this.encontrarResultados();
    this.encontrarSumaPilares(); 
  }
  encontrarSumaPilares(): void {
    this.contestacionesService.getSumapilares(parseInt(this.id)).subscribe({
      next: result=>{
        console.log("Se muestra suma de pilares");
          console.log(result);
          
      },
      error: error=>{
        console.log("Error al buscar datos de contestación");
        
      }
    })
  }
  encontrarResultados(): void {
    this.contestacionesService.findResults(parseInt(this.id)).subscribe({
      next: (result) => {
        console.log('Resultados de busqueda:');
        console.log(result);
        this.resultados = result;
        this.calcularPromedio();
      },
      error: (error) => {
        console.log('error:');
        console.log(error);
      },
    });
  }

  calcularPromedio(): void {
    if (this.resultados.length > 0) {
      const total = this.resultados.reduce(
        (sum, pilar) => sum + pilar.sumaPilar,
        0
      );
      this.promedioPilar = total / this.resultados.length;
    }
  }





  calcularValoresPonderados(): void {
    const preguntasPorPilar: Record<number, Pregunta[]> =
      this.preguntasVisibles.reduce(
        (acc: Record<number, Pregunta[]>, pregunta: Pregunta) => {
          const prePilId = pregunta.prePilId;
          if (!acc[prePilId]) {
            acc[prePilId] = [];
          }
          acc[prePilId].push(pregunta);
          return acc;
        },
        {}
      );

    console.log('Preguntas por pilar');
    console.log(preguntasPorPilar);

    this.valoresPonderadosPorPilar = [];

    let totalPosibleEvaluar = 0;
    let totalEvaluado = 0;
    let totalEvaluadoPilar = 0;
    let calculoPorcentajePonderado = 0;
    let maxPonderacion = 0;
    let minPonderacion = 0;

    for (const prePilId in preguntasPorPilar) {
      const preguntas = preguntasPorPilar[prePilId];
      maxPonderacion = preguntasPorPilar[prePilId][0].maxPonderacion ?? 0;
      minPonderacion = preguntasPorPilar[prePilId][0].minPonderacion ?? 0;
      let totalPosiblePreguntasAbiertas = 0;
      let totalPosiblePreguntasMultiple = 0;
      let totalPosiblePreguntasCerradas = 0;
      totalEvaluadoPilar = 0;
      console.log('Preguntas');
      console.log(preguntas);

      preguntas.forEach((pregunta) => {
        if (pregunta.preTipId == 3) {
          console.log('Pregunta abierta');
          if (pregunta.contestaciones) {
            const valorPreguntaAbierta = pregunta.contestaciones.some(
              (contestacion) => contestacion.corValor !== ''
            )
              ? 1
              : 0;
            totalEvaluado += valorPreguntaAbierta;
            totalEvaluadoPilar += valorPreguntaAbierta;
          }

          totalPosiblePreguntasAbiertas++;
        } else if (pregunta.preTipId == 4) {
          console.log('----------Preguntas de seleccion unicas----');
          pregunta.contestaciones.forEach((contestacion) => {
            const valorRespuestaActual = pregunta.respuesta
              .filter(
                (respuesta) =>
                  respuesta.resPreId == contestacion.corPreId &&
                  contestacion.corResId == respuesta.resId
              )
              .reduce(
                (sum, respuesta) => sum + respuesta.resValorEvaluacion,
                0
              );
            pregunta.respuesta.forEach((respuesta) => {
              return respuesta.resValor;
            });

            const valorMaximo = pregunta.respuesta.reduce((max, respuesta) => {
              return respuesta.resValorEvaluacion > max
                ? respuesta.resValorEvaluacion
                : max;
            }, 0);

            totalPosiblePreguntasCerradas += valorMaximo;
            totalEvaluado += valorRespuestaActual;
            totalEvaluadoPilar += valorRespuestaActual;
          });
        } else if (pregunta.preTipId == 5) {
          console.log('Preguntas de seleccion multiple');
          const valorRespuestaActual = pregunta.respuesta.reduce(
            (sum, respuesta) => sum + respuesta.resValorEvaluacion,
            0
          );
          pregunta.contestaciones.forEach((contestacion) => {
            const valorRespuesta = pregunta.respuesta
              .filter(
                (respuesta) =>
                  respuesta.resPreId == contestacion.corPreId &&
                  contestacion.corResId == respuesta.resId
              )
              .reduce(
                (sum, respuesta) => sum + respuesta.resValorEvaluacion,
                0
              );
            // console.log(
            //   'VALOR EVALUADO SELECCION MULTIPLE-----------------------'
            // );
            // console.log(valorRespuesta);

            totalEvaluado += valorRespuesta;
            totalEvaluadoPilar += valorRespuesta;
          });

          totalPosiblePreguntasMultiple += valorRespuestaActual;
        }
      });

      const totalPosiblePorPilar =
        totalPosiblePreguntasMultiple +
        totalPosiblePreguntasAbiertas +
        totalPosiblePreguntasCerradas;

      console.log(
        '----------------------------Total posible por pilar---------------------------------'
      );
      console.log('VALOR FINAL');
      console.log(totalPosiblePorPilar);
      let valorFinalPilarPonderado = parseFloat(
        ((totalEvaluadoPilar * 100) / totalPosiblePorPilar).toFixed(2)
      );
      totalPosibleEvaluar += totalPosiblePorPilar;

      if (
        valorFinalPilarPonderado <= maxPonderacion &&
        valorFinalPilarPonderado >= minPonderacion
      ) {
        console.log('HEREEE');
        console.log('maxPonderacion', maxPonderacion);
        console.log('minPonderacion', minPonderacion);
        console.log('totalEvaluadoPilar', totalEvaluadoPilar);

        this.valoresPonderadosPorPilar.push({
          prePilId: Number(prePilId),
          valorPonderado: parseFloat(
            ((totalEvaluadoPilar * 100) / totalPosiblePorPilar).toFixed(2)
          ),
        });
      } else if (valorFinalPilarPonderado > maxPonderacion) {
        this.valoresPonderadosPorPilar.push({
          prePilId: Number(prePilId),
          valorPonderado: maxPonderacion,
        });
      } else if (valorFinalPilarPonderado < minPonderacion) {
        this.valoresPonderadosPorPilar.push({
          prePilId: Number(prePilId),
          valorPonderado: minPonderacion,
        });
      }

      console.log('PILAR ACTUAL');
      console.log(prePilId);
    }

    calculoPorcentajePonderado = parseFloat(
      ((100 * totalEvaluado) / totalPosibleEvaluar).toFixed(2)
    );

    this.pilarFinal = calculoPorcentajePonderado;
  }

  generarPdf() {
    console.log('Generando pdf');
    console.log(this.preguntasVisibles);

    // Obtener RFC primero
    this.contestacionesService.getRFC(parseInt(this.id)).subscribe({
        next: (rfcRes) => {
            console.log("Respuesta de RFC");
            console.log(rfcRes);
            
            // Ahora que tenemos el RFC, obtener los datos de sumaPilares
            this.contestacionesService.getSumapilares(parseInt(this.id)).subscribe({
                next: (res) => {
                    console.log('Respuesta a la suma');
                    console.log(res);
                  const bodyRequest = {
                    razonSocial: rfcRes.razonSocial,
                    nombre: rfcRes.nameEmprendedor, 
                    datosEncuesta: res
                  }
                  console.log("Request Nueva:");
                  console.log(bodyRequest);
                  
                  
                    // Generar el archivo PDF con los datos obtenidos
                    this.preguntaListService.generatePdfFile(bodyRequest).subscribe({
                        next: (blob) => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');

                            // Generar el nombre del archivo con RFC y fecha formateada
                            const date = new Date();
                            date.setHours(date.getHours() - 6); // Resta 6 horas
                            const formattedDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 15);
                            const fileName = `${rfcRes.rfc}_${formattedDate}.pdf`;

                            a.href = url;
                            a.download = fileName;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                        },
                        error: (error) => {
                            this.toastr.error("Error al generar archivo.");
                        },
                    });
                },
                error: (error) => {
                    console.log('Error de la búsqueda');
                    console.log(error);
                },
            });
        },
        error: (error) => {
            console.log("Error al obtener RFC");
            console.log(error);
        }
    });
    return;
}



  consultarValorContestacion(contestacion: Contestacion): number {
    const respuesta = this.preguntasVisibles.find((pregunta) => {
      return pregunta.preId == contestacion.corPreId;
    });
    const respuestaDos = respuesta?.respuesta.find((respuesta) => {
      return (
        respuesta.resId == contestacion.corResId &&
        respuesta.resPreId == contestacion.corPreId
      );
    });

    const tipoPregunta = respuesta?.preTipId;
    if (tipoPregunta == 3) {
      return !respuestaDos?.resValor.trim() ? 1 : 0;
    }
    return respuestaDos?.resValorEvaluacion ?? 0;
  }

  modificarDatos(preguntasVisibles: Pregunta[]) {
    console.log('Generando pdf');
    console.log(preguntasVisibles);

    let grupos = [];

    const preguntasPorPilar: Record<number, Pregunta[]> =
      preguntasVisibles.reduce(
        (acc: Record<number, Pregunta[]>, pregunta: Pregunta) => {
          const prePilId = pregunta.prePilId;

          if (!acc[prePilId]) {
            acc[prePilId] = [];
          }
          acc[prePilId].push(pregunta);
          return acc;
        },
        {}
      );

    for (const prepilId in preguntasPorPilar) {
      console.log('DATOS DEL PILAR', prepilId);
      console.log(preguntasPorPilar[prepilId]);

      const nombrePilar =
        preguntasPorPilar[prepilId].find((pilar) => {
          return pilar.prePilId == parseInt(prepilId);
        })?.pildDescription ?? '';

      const pilarActualPreguntas = preguntasPorPilar[prepilId].map(
        (pregunta, index) => {
          return {
            texto: pregunta.prePregunta,
            respuestas: pregunta.contestaciones.map((contestacion, index) => {
              return this.consultarValorContestacion(contestacion).toString();
            }),
          };
        }
      );

      console.log('pil actual preguntas');
      console.log(pilarActualPreguntas);

      const sumaTotalGrupo =
        this.valoresPonderadosPorPilar.find((pilar) => {
          return pilar.prePilId == parseInt(prepilId);
        })?.valorPonderado ?? 0;

      grupos.push({
        preguntas: pilarActualPreguntas,
        sumaTotalGrupo: sumaTotalGrupo,
        nombrePilar: nombrePilar,
      });
    }

    const request = {
      grupos: grupos,
    };
    console.log('RESULTADO FINAL:');
    console.log(request);

    return grupos;
  }

  searchPreguntas() {
    ////MODIFICAR AQUI
    this.preguntaListService.searchPreguntas(parseInt(this.id, 10)).subscribe({
      next: (response) => {
        ///Asignar valores default a preguntas sin contestaciones
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

        ///Proceso para mostrar las contestaciones
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

        ///Proceso para encontrar preguntas padre
        const preguntasMap = new Map<number, Pregunta[]>();
        this.preguntas.forEach((pregunta) => {
          if (!pregunta.prePreIdTrigger && !pregunta.preResIdTrigger) {
            if (!preguntasMap.has(pregunta.preId)) {
              preguntasMap.set(pregunta.preId, []);
            }
            preguntasMap.get(pregunta.preId)!.push(pregunta);
          }
        });

        // Agregar preguntas hijas al mapeo, las cuales hayan sido disparadas ya
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

        // Convertir el mapeo en un array ordenado de preguntas visibles
        this.preguntasVisibles = [];
        preguntasMap.forEach((preguntas) => {
          this.preguntasVisibles.push(...preguntas);
        });
        console.log('MAPEO ORDENADO');
        console.log(this.preguntasVisibles);

        this.calcularValoresPonderados();
        this.grupos = this.modificarDatos(this.preguntasVisibles);
        console.log(
          '------------------------SE MUESTRAN LOS GRUPOS----------------------'
        );
        console.log(this.grupos);
      },
      error: (error) => {
        console.log('error al ejecutar la respuesta');
        console.log(error);
      },
    });
  }
  getTotalRespuestas(preguntas: Pregunta[]): number {
    return preguntas.reduce(
      (total, pregunta) => total + pregunta.respuesta.length,
      0
    );
  }
  volver() {
    // Obtener el ID de la encuesta desde los parámetros de la ruta actual
    const idEncuesta = this.route.snapshot.paramMap.get('id');
    console.log('Enviar');
    console.log(idEncuesta);
    console.log(this.route);

    // Navegar de regreso a /preguntas/:idEncuesta
    this.router.navigate(['/cuestionario', idEncuesta]);
  }
}
