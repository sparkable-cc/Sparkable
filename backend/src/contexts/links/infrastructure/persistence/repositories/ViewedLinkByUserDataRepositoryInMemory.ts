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

}