import { ErrorLog } from "../models/ErrorLog";

export interface ErrorLogRepository {
  storeErrorLog: (errorLog: ErrorLog) => Promise<void>;
}