import DataBuffer from '@/utilities/DataBuffer';
import { ContextTypesHeaders } from '@/models/enum/ContextTypesHeaders';
import { MapUploaderContextHeaders } from '@/models/enum/MapUploadContextHeaders';
import IMapUploadContextHelper from '../Abstractions/IMapUploadContextHelper';

export default class MapUploadContextHelper implements IMapUploadContextHelper {

    public parseMapPartOK(data: DataBuffer): number {
        return data.getUint32();
    }


    public parseMapSaved(data: DataBuffer): string {
        return data.getNullTerminatedString();
    }

    public createContextRequest(MapSize: number, MapName: string): Blob {
        let ab = new ArrayBuffer(7);
        let df = new DataView(ab);

        df.setInt8(0, 0); // GLOBAL CONTEXT
        df.setInt8(1, 1); // CONTEXT REQ
        df.setInt8(2, ContextTypesHeaders.MapUpload);
        df.setUint32(3, MapSize, true);

        let nullbyte = new ArrayBuffer(1);

        return new Blob([df, MapName, nullbyte]);
    }


    public createMapPart(mapPart: Blob): Blob {
        let ab = new ArrayBuffer(2);
        let df = new DataView(ab);

        df.setInt8(0, ContextTypesHeaders.MapUpload);
        df.setInt8(1, MapUploaderContextHeaders.MapPartRequest);

        return new Blob([df, mapPart]);
    }

    public createMapSave(): ArrayBuffer {
        let ab = new ArrayBuffer(2);
        let df = new DataView(ab);

        df.setInt8(0, ContextTypesHeaders.MapUpload);
        df.setInt8(1, MapUploaderContextHeaders.MapSaveRequest);

        return ab;
    }
}