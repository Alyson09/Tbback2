import express, { Request, Response } from "express";
import cors from "cors";
import { jogadores, Jogador, obterJogadorPorId } from "./jogadores";
import fs from "fs";

/* Alyson Flavio Rodrigues Dos Santos*/

const app = express();
app.use(express.json());
app.use(cors());

let jogadorId = 1;

function carregarDadosJogadores() {
    try {
      const dados = fs.readFileSync("dadosJogadores.json", "utf8");
      const jogadoresDoArquivo = JSON.parse(dados);
      jogadores.push(...jogadoresDoArquivo);
    } catch (error) {
      console.error("Erro ao carregar dados de jogadores do arquivo:", error);
    }
  }
  
carregarDadosJogadores();
  
app.post("/players", (req: Request, res: Response) => {
    const data = req.body as Jogador;
  
    if (!data.nome || !data.idade || !data.username) {
      return res.status(400).json({ error: "Faltam informações obrigatórias" });
    }

    if (jogadores.find((jogador) => jogador.id === data.id)) {
      return res.status(400).json({ error: "Jogador com o mesmo ID já existe" });
    }
  
    const newPlayer: Jogador = {
      id: jogadorId,
      nome: data.nome,
      idade: data.idade,
      username: data.username,
    };
  
    jogadores.push(newPlayer);
  
    fs.writeFileSync("dadosJogadores.json", JSON.stringify(jogadores, null, 2));
  
    jogadorId++;
  
    return res.status(201).json({ message: "Jogador criado com sucesso" });
});

app.get("/players", (req: Request, res: Response) => {
  res.json(jogadores);
});

app.put("/players/:id", (req: Request, res: Response) => {
  const jogadorId = parseInt(req.params.id);
  const jogadorExistente = obterJogadorPorId(jogadorId);

  if (!jogadorExistente) {
    return res.status(404).json({ error: "Jogador não encontrado" });
  }

  const data = req.body as Jogador;

  if (!data.nome || !data.idade || !data.username) {
    return res.status(400).json({ error: "Faltam informações obrigatórias" });
  }

  jogadorExistente.nome = data.nome;
  jogadorExistente.idade = data.idade;
  jogadorExistente.username = data.username;

  fs.writeFileSync("dadosJogadores.json", JSON.stringify(jogadores, null, 2));

  return res.status(200).json({ message: "Jogador atualizado com sucesso", jogador: jogadorExistente });
});

app.delete("/players/:id", (req: Request, res: Response) => {
    const jogadorId = parseInt(req.params.id);
    const jogadorIndex = jogadores.findIndex((jogador) => jogador.id === jogadorId);
  
    if (jogadorIndex === -1) {
      return res.status(404).json({ error: "Jogador não encontrado" });
    }
  
    jogadores.splice(jogadorIndex, 1);
  
    fs.writeFileSync("dadosJogadores.json", JSON.stringify(jogadores, null, 2));
  
    return res.status(200).json({ message: "Jogador excluído com sucesso" });
});

app.get("/players/search", (req: Request, res: Response) => {
  const { nome, idade, username } = req.query;

  const jogadoresEncontrados = jogadores.filter((jogador) => {
    const nomeMinusculo = jogador.nome.toLowerCase();
    const usernameMinusculo = jogador.username.toLowerCase();

    return (!nome || nomeMinusculo.includes((nome as string).toLowerCase())) &&
      (!username || usernameMinusculo.includes((username as string).toLowerCase())) &&
      (!idade || jogador.idade.toString() === idade.toString());
  });

  if (jogadoresEncontrados.length > 0) {
    return res.status(200).json(jogadoresEncontrados);
  } else {
    return res.status(404).json({ error: "Nenhum jogador encontrado com os critérios especificados" });
  }
});

app.get("/players/:id", (req: Request, res: Response) => {
  const jogadorId = parseInt(req.params.id);
  const jogador = obterJogadorPorId(jogadorId);

  if (jogador) {
    return res.status(200).json(jogador);
  } else {
    return res.status(404).json({ error: "Jogador não encontrado12" });
  }
});
   
app.get('/', (req: Request, res: Response) => {
  res.send("Olá mundo");
});

app.listen(3003, () => {
  console.log("Server is running in http://localhost:3003");
});
