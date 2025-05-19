import { PartialType } from '@nestjs/mapped-types';
import { CreateDebutDto } from "./create-debut.dto";

export class UpdateDebutDto extends PartialType(CreateDebutDto) {}
