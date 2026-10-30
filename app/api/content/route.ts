import { readContent, saveContent } from "../../../lib/content-store";
import { errorResponse, jsonBody, requireAdmin, sameOrigin } from "../../../lib/admin-auth";
export const runtime="nodejs";
export async function GET(){try{return Response.json(await readContent(),{headers:{"Cache-Control":"no-store"}});}catch(error){return errorResponse(error);}}
export async function PUT(request:Request){try{sameOrigin(request);await requireAdmin(request);return Response.json(await saveContent(await jsonBody(request)),{headers:{"Cache-Control":"no-store"}});}catch(error){return errorResponse(error);}}
