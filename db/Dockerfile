FROM amazon/dynamodb-local:latest

WORKDIR /home/dynamodblocal

# Run in-memory: the seed runs automatically on every Next.js boot via instrumentation.ts
CMD ["-jar", "DynamoDBLocal.jar", "-sharedDb", "-inMemory"]
