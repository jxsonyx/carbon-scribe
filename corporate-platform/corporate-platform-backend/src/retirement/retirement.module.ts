import { Module } from '@nestjs/common';
import { RetirementService } from './retirement.service';
import { RetirementController } from './retirement.controller';
import { InstantRetirementService } from './services/instant-retirement.service';
import { ValidationService } from './services/validation.service';
import { CertificateService } from './services/certificate.service';
import { HistoryService } from './services/history.service';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [SecurityModule],
  providers: [
    RetirementService,
    InstantRetirementService,
    ValidationService,
    CertificateService,
    HistoryService,
  ],
  controllers: [RetirementController],
  exports: [RetirementService, InstantRetirementService, ValidationService],
})
export class RetirementModule {}
