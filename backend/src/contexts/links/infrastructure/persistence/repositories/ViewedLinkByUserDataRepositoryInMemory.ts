import { ViewedLinkByUserData } from "../../../domain/models/ViewedLinkByUserData";
import { ViewedLinkByUserDataDto } from "../../../domain/models/ViewedLinkByUserDataDto";
import { ViewedLinkByUserDataRepository } from "../../../domain/repositories/ViewedLinkByUserDataRepository";

export class ViewedLinkByUserDataRepositoryInMemory implements ViewedLinkByUserDataRepository {
  collection: ViewedLinkByUserDataDto[];

  constructor() {
    this.collection = [];
  }

  store(data: ViewedLinkByUserData){
    this.collection.push(data);
  }

  findData(params: Object): Promise<ViewedLinkByUserDataDto | null> {
    if (this.collection) {
      return new Promise((resolve) => resolve(this.collection[0]));
    } else {
      return new Promise((resolve) => resolve(null));
    }
  }

}