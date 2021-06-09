import { v4 as uuidV4 } from "uuid";


class Moeda {
  id?: string;
  descricao: string;


  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Moeda }