export interface Jogador {
    id: number;
    nome: string;
    idade: number;
    username: string;
  }
  
  export const jogadores: Jogador[] = [];
  
  export function listarJogadoresEmFormatoJSON() {
    return JSON.stringify(jogadores, null, 2);
  }
  
  export function obterJogadorPorId(id: number) {
    return jogadores.find((jogador) => jogador.id === id);
  }
  