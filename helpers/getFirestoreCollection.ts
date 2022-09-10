export default function getFirestoreCollection(collection: string): string {
  switch (process.env.NEXT_PUBLIC_GAMERARENA_STAGE) {
    case 'development':
      return `development-${collection}`;
    case 'staging':
      return `staging-${collection}`;
    case 'production':
      return collection;
    default:
      throw new Error(`Invalid stage: ${process.env.NEXT_PUBLIC_GAMERARENA_STAGE}`);
  }
}
