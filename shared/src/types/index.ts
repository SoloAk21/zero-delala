import {
  ETHIOPIAN_REGIONS,
  ADDIS_ABABA_SUBCITIES,
} from "../constants/ethiopia.js";

export type EthiopianRegion = (typeof ETHIOPIAN_REGIONS)[number];
export type AddisAbabaSubcity = (typeof ADDIS_ABABA_SUBCITIES)[number];

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
