import DataBuffer from '@/utilities/DataBuffer';
import ErrorModel from '@/models/responses/ErrorModel';
import { GlobalContextHeaders } from '@/models/enum/GlobalContextHeaders';
import { ContextTypesHeaders } from '@/models/enum/ContextTypesHeaders';
import UserAuthModel from '@/models/responses/UserAuthModel';
import IntegrationByTokenModel from '@/models/responses/IntegrationByTokenModel';
import IGlobalContextHelper from '../Abstractions/IGlobalContextHelper';

export default class GlobalContextHelper implements IGlobalContextHelper {

    public parseError(data: DataBuffer): ErrorModel {
        let resp: ErrorModel = new ErrorModel();

        resp.code = data.getInt8();
        resp.description = data.getNullTerminatedString();

        return resp;
    }

    public createUserAuth(type: number, token: string, force: number): Blob {
        let ab = new ArrayBuffer(4);
        let df = new DataView(ab);

        df.setInt8(0, ContextTypesHeaders.GlobalContext);
        df.setInt8(1, GlobalContextHeaders.UserAuthRequest);
        df.setInt8(2, type);
        df.setInt8(3, force);

        return new Blob([df, token, new ArrayBuffer(1)]);
    }

    public createInterrationAdd(type: number, token: string): Blob {
        let ab = new ArrayBuffer(3);
        let df = new DataView(ab);

        df.setInt8(0, ContextTypesHeaders.GlobalContext);
        df.setInt8(1, GlobalContextHeaders.AddIntegrationTokenRequest);
        df.setInt8(2, type);

        return new Blob([df, token, new ArrayBuffer(1)]);
    }

    public createGetBNETKey(): Blob {
        let ab = new ArrayBuffer(2);
        let df = new DataView(ab);

        df.setInt8(0, ContextTypesHeaders.GlobalContext);
        df.setInt8(1, GlobalContextHeaders.GetBnetKeyRequest);

        return new Blob([df]);
    }

    public createSetConnectorName(name: string): Blob {
        let ab = new ArrayBuffer(2);
        let df = new DataView(ab);

        df.setInt8(0, ContextTypesHeaders.GlobalContext);
        df.setInt8(1, GlobalContextHeaders.SetConnectorNameAnswer);

        return new Blob([df, name, new ArrayBuffer(1)]);
    }

    public parseUserAuthResponse(data: DataBuffer): UserAuthModel {
        let response: UserAuthModel = new UserAuthModel();

        response.id = data.getNullTerminatedString();
        response.nickname = data.getNullTerminatedString();
        response.avatarUrl = data.getNullTerminatedString();

        response.localId = data.getInt32();
        response.discordId = data.getNullTerminatedString();
        response.vkId = data.getInt32();
        response.realm = data.getNullTerminatedString();
        response.bnetName = data.getNullTerminatedString();
        response.connectorName = data.getNullTerminatedString();
        response.mainType = data.getInt8();

        return response;
    }

    public parseBnetKey(data: DataBuffer): string {
        return data.getNullTerminatedString();
    }

    public parseIntegrationByToken(data: DataBuffer): IntegrationByTokenModel {
        let response: IntegrationByTokenModel = new IntegrationByTokenModel()

        response.localId = data.getInt32();
        response.discordId = data.getNullTerminatedString();
        response.vkId = data.getInt32();
        response.realm = data.getNullTerminatedString();
        response.bnetName = data.getNullTerminatedString();
        response.connectorName = data.getNullTerminatedString();
        response.mainType = data.getInt8();

        return response;
    }

    public createDeleteIntegration(type: number): Blob {
        let ab = new ArrayBuffer(3);
        let df = new DataView(ab);

        df.setInt8(0, ContextTypesHeaders.GlobalContext);
        df.setInt8(1, GlobalContextHeaders.DeleteIntegrationAnswer);
        df.setInt8(2, type);

        return new Blob([df]);
    }
}
