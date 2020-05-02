import DataBuffer from '@/utilities/DataBuffer';
import ErrorModel from '@/models/responses/ErrorModel';
import UserAuthModel from '@/models/responses/UserAuthModel';
import IntegrationByTokenModel from '@/models/responses/IntegrationByTokenModel';

export interface IGlobalContextHelper {
    createUserAuth(type: number, token: string, force: number): Blob;
    createInterrationAdd(type: number, token: string): Blob;
    createGetBNETKey(): Blob;
    createSetConnectorName(name: string): Blob;
    createDeleteIntegration(type: number): Blob;

    parseError(data: DataBuffer): ErrorModel;
    parseUserAuthResponse(data: DataBuffer): UserAuthModel;
    parseBnetKey(data: DataBuffer): string;
    parseIntegrationByToken(data: DataBuffer): IntegrationByTokenModel;
}