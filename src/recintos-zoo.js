class RecintosZoo {
  constructor() {
    // Define os recintos com suas características
    this.recintos = [
      {
        numero: 1,
        bioma: "savana",
        tamanhoTotal: 10,
        especieNoRecinto: [{ especie: "MACACO", quantidade: 3 }],
      },
      { numero: 2, bioma: "floresta", tamanhoTotal: 5, especieNoRecinto: [] },
      {
        numero: 3,
        bioma: "savana e rio",
        tamanhoTotal: 7,
        especieNoRecinto: [{ especie: "GAZELA", quantidade: 1 }],
      },
      { numero: 4, bioma: "rio", tamanhoTotal: 8, especieNoRecinto: [] },
      {
        numero: 5,
        bioma: "savana",
        tamanhoTotal: 9,
        especieNoRecinto: [{ especie: "LEAO", quantidade: 1 }],
      },
    ];

    // Define os animais aceitos e suas características
    this.animaisNovos = [
      {
        especie: "LEAO",
        quantidadeAnimaisNovos: 3,
        biomas: ["savana"],
        carnivoro: true,
      },
      {
        especie: "LEOPARDO",
        quantidadeAnimaisNovos: 2,
        biomas: ["savana"],
        carnivoro: true,
      },
      {
        especie: "CROCODILO",
        quantidadeAnimaisNovos: 3,
        biomas: ["rio"],
        carnivoro: true,
      },
      {
        especie: "MACACO",
        quantidadeAnimaisNovos: 1,
        biomas: ["savana", "floresta"],
        carnivoro: false,
      },
      {
        especie: "GAZELA",
        quantidadeAnimaisNovos: 2,
        biomas: ["savana"],
        carnivoro: false,
      },
      {
        especie: "HIPOPOTAMO",
        quantidadeAnimaisNovos: 4,
        biomas: ["savana", "rio"],
        carnivoro: false,
      },
    ];
  }

  especiesAceitasPeloZoo(especie, quantidade) {
    const especieAceitapeloZoo = this.animaisNovos.find(
      (animal) => animal.especie === especie.toUpperCase()
    );

    if (!especieAceitapeloZoo) {
      return { erro: "Animal inválido" };
    }

    if (quantidade <= 0 || isNaN(quantidade) || quantidade % 1 !== 0) {
      return { erro: "Quantidade inválida" };
    }

    return especieAceitapeloZoo;
  }

  analisaRecintos(especie, quantidade) {
    const animal = this.especiesAceitasPeloZoo(especie, quantidade);
    if (animal.erro) return animal;

    const recintosViaveis = this.recintos.filter((recinto) =>
      this.verificaRecintoViavel(animal, recinto, quantidade)
    );

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    const recintosOk = recintosViaveis.map((recinto) => {
      const espacoLivre =
        recinto.tamanhoTotal -
        this.animaisExistentesNoRecinto(recinto) -
        quantidade;

      return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
    });

    return { recintosViaveis: recintosOk };
  }

  verificaRecintoViavel(animal, recinto, quantidade) {
    if (!this.biomaSavanaErio(animal, recinto)) {
      return false;
    }

    const espacoOcupado = this.animaisExistentesNoRecinto(recinto) + quantidade;
    const espacoNecessario =
      this.animaisExistentesNoRecinto(recinto) + quantidade;
    if (recinto.tamanhoTotal - espacoOcupado < espacoNecessario) {
      return false;
    }

    if (
      animal.especie === "MACACO" &&
      recinto.especieNoRecinto.length === 0 &&
      quantidade === 1
    ) {
      return false;
    }

    if (
      animal.especie === "HIPOPOTAMO" &&
      recinto.bioma !== "savana e rio" &&
      recinto.especieNoRecinto.length > 0
    ) {
      return false;
    }

    if (this.animaisCarnivoros(animal, recinto)) {
      return false;
    }

    return true;
  }

  biomaSavanaErio(animal, recinto) {
    if (recinto.bioma === "savana e rio") {
      return animal.biomas.includes("savana") || animal.biomas.includes("rio");
    }
    return animal.biomas.includes(recinto.bioma);
  }

  animaisExistentesNoRecinto(recinto) {
    let espacoOcupado = 0;

    const outraEspecieNoRecinto = recinto.especieNoRecinto.some(
      (animal) => animal.especie !== animal.especie
    );

    if (outraEspecieNoRecinto) {
      espacoOcupado += 1;
    }

    recinto.especieNoRecinto.forEach((animal) => {
      espacoOcupado += animal.quantidade;
    });
    return espacoOcupado;
  }

  animaisCarnivoros(animal, recinto) {
    const carnivoroNoRecinto = recinto.especieNoRecinto.find((a) => {
      const especieAnimal = this.animaisNovos.find(
        (animal) => animal.especie === a.especie
      );
      return especieAnimal && especieAnimal.carnivoro;
    });

    if (carnivoroNoRecinto) {
      const especieCarnivoro = carnivoroNoRecinto.especie;
      if (animal.especie !== especieCarnivoro) {
        return true;
      }
    }

    if (
      animal.carnivoro &&
      !carnivoroNoRecinto &&
      recinto.especieNoRecinto.length > 0
    ) {
      return true;
    }

    return false;
  }
}

export { RecintosZoo as RecintosZoo };

const zoo = new RecintosZoo();

console.log(zoo.analisaRecintos("MACACO", 2));
// Exemplo de saída para lote que não pode ser dividido: { erro: "Não há recinto viável" }

console.log(zoo.analisaRecintos("CROCODILO", 1));
// Saída esperada: { recintosViaveis: ["Recinto 1 (espaço livre: 5 total: 10)", "Recinto 2 (espaço livre: 3 total: 5)", "Recinto 3 (espaço livre: 2 total: 7)"] }
