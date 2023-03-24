import { ViewedLinkByUserData } from "../models/ViewedLinkByUserData";
import { ViewedLinkByUserDataDto } from "../models/ViewedLinkByUserDataDto";

export interface ViewedLinkByUserDataRepository {
  store: (data: ViewedLinkByUserData) => void;
  findData: (params:Object) => Promise<ViewedLinkByUserDataDto | null>;
  getAllData: (params:Object) =>  Promise<[ViewedLinkByUserDataDto[], number]>
}