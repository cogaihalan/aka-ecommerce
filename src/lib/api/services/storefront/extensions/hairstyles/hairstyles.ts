import { ServerHairstyleService } from "../../../server/extensions/hairstyles";

export class StorefrontServerHairstyleService extends ServerHairstyleService {
  protected basePath = "/user/hairstyles";
}

export const storefrontServerHairstyleService =
  new StorefrontServerHairstyleService();
