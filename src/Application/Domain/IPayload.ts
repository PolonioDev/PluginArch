export type IPayloadTypes = number | string | boolean | undefined | bigint;
export type IPayloadBasicTypes = IPayloadTypes | IPayloadTypes[];
export type IPayloadObject = {
	[attr: string | number]: IPayloadBasicTypes | IPayloadObject;
}
export type ISerializablePayload = IPayloadObject | IPayloadBasicTypes;
export type IPayload = Record<string | number, any>;
export default IPayload;
