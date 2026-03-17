import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer, Consumer, Admin, Partitioners } from 'kafkajs';
import { ConfigService } from '../config/config.service';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin;
  private readonly kafkaEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const kafkaConfig = this.configService.getKafkaConfig();
    this.kafkaEnabled = kafkaConfig.brokers.length > 0;

    if (!this.kafkaEnabled) {
      this.logger.warn(
        'Kafka is disabled because KAFKA_BROKERS is not configured. Event bus features will be unavailable.',
      );
    }

    let sasl: any = undefined;
    if (kafkaConfig.sasl) {
      sasl = {
        mechanism: kafkaConfig.sasl.mechanism,
        username: kafkaConfig.sasl.username,
        password: kafkaConfig.sasl.password,
      };
    }

    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      ssl: kafkaConfig.ssl,
      sasl: sasl,
      retry: kafkaConfig.retry
        ? {
            initialRetryTime: kafkaConfig.retry.initialRetryTime,
            retries: kafkaConfig.retry.retries,
          }
        : undefined,
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    this.admin = this.kafka.admin();
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    if (!this.kafkaEnabled) {
      return;
    }

    this.logger.log('Connecting to Kafka...');
    await this.producer.connect();
    await this.admin.connect();
    this.logger.log('Kafka connected successfully.');
  }

  private async disconnect() {
    if (!this.kafkaEnabled) {
      return;
    }

    this.logger.log('Disconnecting from Kafka...');
    await this.producer.disconnect();
    await this.admin.disconnect();
    this.logger.log('Kafka disconnected successfully.');
  }

  isEnabled(): boolean {
    return this.kafkaEnabled;
  }

  getProducer(): Producer {
    if (!this.kafkaEnabled) {
      throw new Error('Kafka is disabled: KAFKA_BROKERS is not configured');
    }

    return this.producer;
  }

  getAdmin(): Admin {
    if (!this.kafkaEnabled) {
      throw new Error('Kafka is disabled: KAFKA_BROKERS is not configured');
    }

    return this.admin;
  }

  createConsumer(groupId: string): Consumer {
    if (!this.kafkaEnabled) {
      throw new Error('Kafka is disabled: KAFKA_BROKERS is not configured');
    }

    return this.kafka.consumer({ groupId });
  }
}
