<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A thin wrapper around the [@aws-sdk/client-sns](https://www.npmjs.com/package/@aws-sdk/client-sns) library to be used in NestJs applications.
</p>

<p align="center">
  <a href="https://www.npmjs.com/org/vetsmm"><img src="https://img.shields.io/npm/v/@vetsmm/nestjs-sns.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/org/vetsmm"><img src="https://img.shields.io/npm/l/@vetsmm/nestjs-sns.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/org/vetsmm"><img src="https://img.shields.io/npm/dm/@vetsmm/nestjs-sns.svg" alt="NPM Downloads" /></a>
  <a href="https://opencollective.com/vmm#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
</p>


**Note: The only methods available out of the box are `publish` and `createTopic`. If you need additional methods you can do one of the following.**
1. Fork this repo and do as you please
2. Open an issue (or a PR :heart:)
3. Manually via `this.snsService.snsClient.<SNS_METHOD>`

### Installation

```sh
npm install --save @vetsmm/nestjs-sns
#or
yarn add @vetsmm/nestjs-sns
```

## Getting Started
Add and initialize the global module to your App.module.ts

### Using `.registerAsync()` for dynamic values (preferred)

```typescript
import { SnsModule } from 'nestjs-sns';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SnsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endpoint: configService.get<string>('AWS_SNS_ENDPOINT'),
        region: configService.get<string>('AWS_REGION'),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
Also supports `useClass` in `registerAsync` if you have a configuration class.

### Using `.register()` for static values
```typescript
import { SnsModule } from 'nestjs-sns';

@Module({
  imports: [
    SnsModule.register({
      endpoint: 'http://localhost:4566',
      region: 'us-east-1',
      // ...any other options accepted by SNS client
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Usage
**NOTE: If using the `isGlobal: true` option, you do not need to import this service into other modules that belong to App.module**

```typescript
import { Controller, Get } from '@nestjs/common';
import { SnsService } from 'nestjs-sns';
import { MessageService } from './message.service';

@Controller()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly snsService: SnsService,
  ) {}

  @Get()
  async newMessage() {
    const snsRes = await this.snsService.publish({
      Message: 'Test Message',
      TopicArn: 'arn:aws:sns:us-east-1:000000000000:my-topic',
    });
    return snsRes;
  }
}
```

### Contributing

* [Mark Tripoli](https://github.com/triippz)

### License

MIT


### Thanks To
OG Fork from [nestjs-sns](https://github.com/eklemen/nestjs-sns)
