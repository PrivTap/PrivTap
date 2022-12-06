import { SchemaTypes } from "mongoose";

SchemaTypes.ObjectId.get((v) => v.toString());