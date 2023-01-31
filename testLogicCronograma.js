function User(name, id) {
  this.name = name;
  this.id = id;
}
const participantes = {
  cantantesExperimentados: [
    new User("Chellys", 1),
    new User("Lior", 2),
    new User("Ilemar", 3),
  ],
  cantantesEnFormacion: [
    new User("Gabriel", 4),
    new User("Emmanuel", 5),
    new User("Jenny", 6),
    new User("Evilmar", 7),
    new User("Stephany", 8),
  ],
  musicos: {
    guitarra: [new User("Ochundia", 9), new User("Emmanuel", 10)],
    bajo: [new User("Roger", 11), new User("Ilemar", 3)],
    piano: [new User("Carlos", 12), new User("Evilmar", 7)],
    bateria: [new User("Elyany", 13), new User("Ilemar", 3)],
  },
};
// Partipants to added
const createCronogramaDirectores = (count, participants) =>
  participants.cantantesExperimentados[count];
const createCronogramaFormacion = (count, participants) =>
  participants.cantantesEnFormacion[count];
// contadores
const updateCountPartipant = (count, total) => {
  if (count < total - 1) {
    count++;
  } else {
    count = 0;
  }
  return count;
};
const createCronograma = (numOfWeek, participants) => {
  let cronograma = [];
  let contadorExperimentados = 0;
  let contadorFormacion = 0;
  for (let i = 0; i < numOfWeek; i++) {
    contadorExperimentados = updateCountPartipant(
      contadorExperimentados,
      participants.cantantesExperimentados.length
    );
    contadorFormacion = updateCountPartipant(
      contadorFormacion,
      participants.cantantesEnFormacion.length
    );
    cronograma.push({
      directores: [
        createCronogramaDirectores(contadorExperimentados, participants),
        createCronogramaFormacion(contadorFormacion, participants),
      ],
    });
  }
  return cronograma;
};

console.log(createCronograma(4, participantes));
//console.log(participantes);
