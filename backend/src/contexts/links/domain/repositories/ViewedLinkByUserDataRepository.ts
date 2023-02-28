import { ViewedLinkByUserData } from "../models/ViewedLinkByUserData";

export interface ViewedLinkByUserDataRepository {
  store: (data: ViewedLinkByUserData) => void;
}