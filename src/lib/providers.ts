import { extendedProviders } from "./market-providers";
import { Provider } from "./types";

export const providers: Provider[] = extendedProviders.map((provider) => ({
  id: provider.id,
  name: provider.name,
  type: provider.type,
  area: provider.area,
  price: provider.price,
  bestFor: provider.bestFor,
  category: provider.category,
  imageUrl: provider.imageUrl,
  sourceUrl: provider.sourceUrl,
}));
