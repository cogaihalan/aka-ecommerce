import { ServerHairstyleService } from "../../../server/extensions/hairstyles";

export class ServerStorefrontHairstyleService extends ServerHairstyleService {
  protected basePath = "/user/hairstyles";
}

export const serverStorefrontHairstyleService =
  new ServerStorefrontHairstyleService();
