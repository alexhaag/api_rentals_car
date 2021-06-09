import { v4 as uuidV4 } from "uuid";


class Foto {
  id?: string;
  nome: string;
  url: string;


  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Foto }