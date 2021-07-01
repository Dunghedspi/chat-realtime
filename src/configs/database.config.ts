import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";

@Injectable()
export class DatabaseConfig implements SequelizeOptionsFactory {
    constructor(private configService: ConfigService) {
    }

    createSequelizeOptions(connectionName?: string): Promise<SequelizeModuleOptions> | SequelizeModuleOptions {
        return this.configService.get('database');
    }
}