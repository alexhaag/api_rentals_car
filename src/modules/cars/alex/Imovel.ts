import { v4 as uuidV4 } from "uuid";

class Imovel {
  id?: string;
  area: number;
  preco: number;
  cidade: string;
  uf: string;
  publicar: boolean;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Imovel }