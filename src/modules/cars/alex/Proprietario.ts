import { v4 as uuidV4 } from "uuid";


class Proprietario {
  id?: string;
  nome: string;
  endereco: string;
  numero: number;
  cidade: string;
  uf: string;
  telefone: string;
  email: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Proprietario }