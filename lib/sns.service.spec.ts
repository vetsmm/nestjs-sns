import { Test, TestingModule } from '@nestjs/testing';
import { SNS_OPTIONS } from './sns.constants';
import * as sns from '@aws-sdk/client-sns';
import {SnsService} from "./sns.service";

const mMetaData = {
  httpStatusCode: 200,
};
export const mPublishCommand: sns.PublishCommandOutput = {
  MessageId: 'test-id',
  SequenceNumber: '123456',
  $metadata: mMetaData,
};

export const mCreateTopicReponse: sns.CreateTopicCommandOutput = {
  TopicArn: 'new-topic-arn',
  $metadata: mMetaData,
};

jest.mock('@aws-sdk/client-sns', () => {
  const mSns = {
    send: jest.fn(),
  };
  return {
    SNSClient: jest.fn(() => mSns),
    PublishCommand: jest.fn(() => mPublishCommand),
    CreateTopicCommand: jest.fn(() => mCreateTopicReponse),
  };
});

describe('SnsService', () => {
  let service: SnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnsService,
        {
          provide: SNS_OPTIONS,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SnsService>(SnsService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('#createTopic', () => {
    test('pass params through to CreateTopicCommand and call send', async () => {
      expect(service.createTopic).toBeDefined();
      const createTopicInput = {
        Name: 'MyNewTopic',
      };
      await service.createTopic(createTopicInput);
      expect(sns.CreateTopicCommand).toHaveBeenCalledWith(createTopicInput);
      expect(service.snsClient.send)
        .toHaveBeenCalledWith(new sns.CreateTopicCommand(createTopicInput));
    });
  });
  describe('#publish', () => {
    test('pass params through to PublishCommand and call send', async () => {
      expect(service.publish).toBeDefined();
      const publishInput = {
        Message: 'Test Message',
        TopicArn: 'test-arn',
      };
      await service.publish(publishInput);
      expect(sns.PublishCommand).toHaveBeenCalledWith(publishInput);
      expect(service.snsClient.send)
        .toHaveBeenCalledWith(new sns.PublishCommand(publishInput));
    });
  });
});
