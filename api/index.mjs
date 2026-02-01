var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// generated/prisma/enums.js
var require_enums = __commonJS({
  "generated/prisma/enums.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Role = exports.BookingStatus = void 0;
    exports.BookingStatus = {
      CONFIRMED: "CONFIRMED",
      COMPLETED: "COMPLETED",
      CANCELLED: "CANCELLED"
    };
    exports.Role = {
      STUDENT: "STUDENT",
      TUTOR: "TUTOR",
      ADMIN: "ADMIN"
    };
  }
});

// src/app.ts
import express4 from "express";
import cors from "cors";

// src/modules/tutor/tutor.routes.ts
import express from "express";

// src/middleware/authentication.ts
import jwt from "jsonwebtoken";
var auth = (...roles) => {
  return (req, res, next) => {
    try {
      let token = req.cookies?.token;
      if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No token provided"
        });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (typeof decoded === "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token payload"
        });
      }
      const payload = decoded;
      if (!payload.id || !payload.role) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token structure"
        });
      }
      req.user = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        isBanned: payload.isBanned
      };
      console.log(req.user);
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to access this resource"
        });
      }
      next();
    } catch {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token"
      });
    }
  };
};

// src/utils/paginationSorting.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSorting_default = paginationSortingHelper;

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
var client_exports = {};
__export(client_exports, {
  $Enums: () => $Enums,
  Prisma: () => prismaNamespace_exports,
  PrismaClient: () => PrismaClient
});
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.2.0",
  "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum WeekDay {\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n  SATURDAY\n  SUNDAY\n}\n\nmodel Availability {\n  id        String  @id @default(uuid())\n  day       WeekDay\n  startTime String\n  endTime   String\n\n  tutorId String\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id])\n\n  @@map("availability")\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nmodel Booking {\n  id        String        @id @default(uuid())\n  status    BookingStatus @default(CONFIRMED)\n  date      DateTime\n  startTime String\n  endTime   String\n\n  studentId String\n  tutorId   String\n\n  student User         @relation("StudentBookings", fields: [studentId], references: [id])\n  tutor   TutorProfile @relation("TutorBookings", fields: [tutorId], references: [id])\n\n  review Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("booking")\n}\n\nmodel Category {\n  id   String @id @default(uuid())\n  name String @unique\n\n  tutors TutorProfile[]\n\n  createdAt DateTime @default(now())\n\n  @@map("category")\n}\n\nmodel Review {\n  id      String  @id @default(uuid())\n  rating  Int // 1\u20135\n  comment String?\n\n  studentId String\n  tutorId   String\n  bookingId String @unique\n\n  student User         @relation("StudentReviews", fields: [studentId], references: [id])\n  tutor   TutorProfile @relation("TutorReviews", fields: [tutorId], references: [id])\n  booking Booking      @relation(fields: [bookingId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@map("review")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  id         String   @id @default(uuid())\n  bio        String\n  hourlyRate Float\n  experience Int\n  rating     Float    @default(0)\n  subjects   String[]\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id])\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  reviews      Review[]       @relation("TutorReviews")\n  Bookings     Booking[]      @relation("TutorBookings")\n  availability Availability[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("tutor_profile")\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nmodel User {\n  id            String  @id @default(uuid())\n  name          String\n  email         String  @unique\n  password      String\n  phone         String?\n  emailVerified Boolean @default(false)\n  image         String?\n\n  role     Role    @default(STUDENT)\n  isBanned Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Your custom relations\n  tutorProfile     TutorProfile?\n  studentBookings  Booking[]     @relation("StudentBookings")\n  reviewsAsStudent Review[]      @relation("StudentReviews")\n\n  @@map("user")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"day","kind":"enum","type":"WeekDay"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"}],"dbName":"availability"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorBookings"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"booking"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tutors","kind":"object","type":"TutorProfile","relationName":"CategoryToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"category"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentReviews"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorReviews"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"review"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"subjects","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"TutorReviews"},{"name":"Bookings","kind":"object","type":"Booking","relationName":"TutorBookings"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"tutor_profile"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviewsAsStudent","kind":"object","type":"Review","relationName":"StudentReviews"}],"dbName":"user"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  }
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.2.0",
  engine: "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Availability: "Availability",
  Booking: "Booking",
  Category: "Category",
  Review: "Review",
  TutorProfile: "TutorProfile",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AvailabilityScalarFieldEnum = {
  id: "id",
  day: "day",
  startTime: "startTime",
  endTime: "endTime",
  tutorId: "tutorId"
};
var BookingScalarFieldEnum = {
  id: "id",
  status: "status",
  date: "date",
  startTime: "startTime",
  endTime: "endTime",
  studentId: "studentId",
  tutorId: "tutorId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  createdAt: "createdAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  studentId: "studentId",
  tutorId: "tutorId",
  bookingId: "bookingId",
  createdAt: "createdAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  bio: "bio",
  hourlyRate: "hourlyRate",
  experience: "experience",
  rating: "rating",
  subjects: "subjects",
  userId: "userId",
  categoryId: "categoryId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  phone: "phone",
  emailVerified: "emailVerified",
  image: "image",
  role: "role",
  isBanned: "isBanned",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
var $Enums = __toESM(require_enums());
__reExport(client_exports, __toESM(require_enums()));
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
import { Pool } from "pg";
var connectionString = `${process.env.DATABASE_URL}`;
var pool = new Pool({ connectionString });
var adapter = new PrismaPg(pool);
var globalForPrisma = global;
var prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// src/modules/tutor/tutor.service.ts
var createTutorProfile = async (data, userId) => {
  const result = await prisma.tutorProfile.create({
    data: {
      ...data,
      userId
    }
  });
  return result;
};
var getAllTutorProfiles = async ({
  search,
  category,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          bio: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          subjects: {
            has: search
          }
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }
  if (category && category.length > 0) {
    andConditions.push({
      category: {
        name: { contains: category, mode: "insensitive" }
      }
    });
  }
  const result = await prisma.tutorProfile.findMany({
    skip,
    take: limit,
    where: {
      AND: andConditions
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      user: true,
      category: true,
      availability: true
    }
  });
  const total = await prisma.tutorProfile.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: result,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getTutorProfileById = async (id) => {
  const result = await prisma.tutorProfile.findUnique({
    where: {
      id
    },
    include: {
      user: true,
      category: true,
      availability: true
    }
  });
  return result;
};
var upsertTutorProfile = async (userId, data) => {
  const result = await prisma.tutorProfile.upsert({
    where: {
      userId
    },
    create: {
      ...data,
      userId
    },
    update: {
      ...data
    },
    include: {
      user: true,
      category: true,
      availability: true
    }
  });
  return result;
};
var deleteTutorProfile = async (userId) => {
  const existingProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId
    }
  });
  if (!existingProfile) {
    throw new Error("Tutor profile not found");
  }
  const result = await prisma.tutorProfile.delete({
    where: {
      userId
    }
  });
  return result;
};
var TutorProfileService = {
  createTutorProfile,
  getAllTutorProfiles,
  getTutorProfileById,
  upsertTutorProfile,
  deleteTutorProfile
};

// src/modules/tutor/tutor.controller.ts
var createTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await TutorProfileService.createTutorProfile(req.body, user.id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getAllTutorProfile = async (req, res) => {
  try {
    const { search } = req.query;
    const category = req.query.category;
    const { page, limit, sortBy, sortOrder, skip } = paginationSorting_default(
      req.query
    );
    const result = await TutorProfileService.getAllTutorProfiles({
      search,
      category,
      page,
      limit,
      sortBy,
      sortOrder,
      skip
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getTutorProfileById2 = async (req, res) => {
  try {
    console.log(req.params.id);
    const result = await TutorProfileService.getTutorProfileById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var upsertTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await TutorProfileService.upsertTutorProfile(
      user.id,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: "Tutor profile saved successfully",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to save tutor profile"
    });
  }
};
var deleteTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await TutorProfileService.deleteTutorProfile(user.id);
    return res.status(200).json({
      success: true,
      message: "Tutor profile deleted successfully",
      data: result
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete tutor profile"
    });
  }
};
var TutorProfileController = {
  createTutorProfile: createTutorProfile2,
  getAllTutorProfile,
  getTutorProfileById: getTutorProfileById2,
  upsertTutorProfile: upsertTutorProfile2,
  deleteTutorProfile: deleteTutorProfile2
};

// generated/prisma/enums.ts
var WeekDay = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY"
};
var BookingStatus = {
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var Role = {
  STUDENT: "STUDENT",
  TUTOR: "TUTOR",
  ADMIN: "ADMIN"
};

// src/modules/tutor/tutor.routes.ts
var router = express.Router();
router.post("/", auth(Role.TUTOR), TutorProfileController.createTutorProfile);
router.get("/", TutorProfileController.getAllTutorProfile);
router.get("/:id", TutorProfileController.getTutorProfileById);
router.put("/profile", auth(Role.TUTOR), TutorProfileController.upsertTutorProfile);
router.delete(
  "/",
  auth(Role.TUTOR),
  TutorProfileController.deleteTutorProfile
);
var TutorProfileRoutes = router;

// src/modules/auth/auth.routes.ts
import express2 from "express";

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt2 from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET;
var JWT_EXPIRES_IN = "7d";
var createUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? Role.STUDENT,
      phone: data.phone ?? null,
      image: data.image ?? null,
      emailVerified: data.emailVerified ?? false,
      isBanned: data.isBanned ?? false
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      emailVerified: true,
      isBanned: true,
      createdAt: true
    }
  });
  const token = jwt2.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isBanned: user.isBanned
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return { user, token };
};
var signInUser = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (user.isBanned) {
    throw new Error("Can't Login! You are Banned by Admin!");
  }
  const isPasswordMatch = await bcrypt.compare(data.password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }
  const token = jwt2.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isBanned: user.isBanned
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return { user, token };
};
var getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      isBanned: true
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
var AuthService = {
  createUser,
  signInUser,
  getUserById
};

// src/modules/auth/auth.controller.ts
var register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }
    const result = await AuthService.createUser(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed"
    });
  }
};
var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    const result = await AuthService.signInUser({ email, password });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password"
    });
  }
};
var getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await AuthService.getUserById(user.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var AuthController = {
  register,
  login,
  getCurrentUser
};

// src/modules/auth/auth.routes.ts
var router2 = express2.Router();
router2.post("/register", AuthController.register);
router2.post("/login", AuthController.login);
router2.get("/me", auth(Role.STUDENT, Role.ADMIN, Role.TUTOR), AuthController.getCurrentUser);
var AuthRoutes = router2;

// src/app.ts
import cookieParser from "cookie-parser";

// src/modules/category/category.routes.ts
import express3 from "express";

// src/modules/category/category.service.ts
var createCategory = async (data) => {
  return prisma.category.create({
    data
  });
};
var getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var getCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      tutors: true
      // optional
    }
  });
};
var updateCategory = async (id, data) => {
  return prisma.category.update({
    where: { id },
    data
  });
};
var deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id }
  });
};
var CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const result = await CategoryService.createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Category creation failed"
    });
  }
};
var getAllCategories2 = async (_req, res) => {
  try {
    const result = await CategoryService.getAllCategories();
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch categories"
    });
  }
};
var getCategoryById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.getCategoryById(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch category"
    });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.updateCategory(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Category update failed"
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryService.deleteCategory(id);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Category deletion failed"
    });
  }
};
var CategoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.routes.ts
var router3 = express3.Router();
router3.post("/", auth(Role.ADMIN), CategoryController.createCategory);
router3.get("/", CategoryController.getAllCategories);
router3.get("/:id", CategoryController.getCategoryById);
router3.patch("/:id", auth(Role.ADMIN), CategoryController.updateCategory);
router3.delete("/:id", auth(Role.ADMIN), CategoryController.deleteCategory);
var CategoryRoutes = router3;

// src/modules/booking/booking.routes.ts
import { Router } from "express";

// src/modules/booking/booking.service.ts
var WEEKDAY_MAP = {
  MONDAY: WeekDay.MONDAY,
  TUESDAY: WeekDay.TUESDAY,
  WEDNESDAY: WeekDay.WEDNESDAY,
  THURSDAY: WeekDay.THURSDAY,
  FRIDAY: WeekDay.FRIDAY,
  SATURDAY: WeekDay.SATURDAY,
  SUNDAY: WeekDay.SUNDAY
};
var createBooking = async (data) => {
  const bookingDate = new Date(data.date);
  if (bookingDate < /* @__PURE__ */ new Date()) {
    throw new Error("Cannot book past dates");
  }
  const weekdayString = bookingDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const day = WEEKDAY_MAP[weekdayString];
  if (!day) {
    throw new Error("Invalid booking day");
  }
  console.log(day);
  const availability = await prisma.availability.findFirst({
    where: {
      tutorId: data.tutorId,
      day,
      startTime: {
        lte: data.startTime
      },
      endTime: {
        gte: data.endTime
      }
    }
  });
  if (!availability) {
    throw new Error("Tutor is not available at this time");
  }
  const conflict = await prisma.booking.findFirst({
    where: {
      tutorId: data.tutorId,
      date: bookingDate,
      status: {
        not: BookingStatus.CANCELLED
      },
      OR: [
        {
          startTime: {
            lt: data.endTime
          },
          endTime: {
            gt: data.startTime
          }
        }
      ]
    }
  });
  if (conflict) {
    throw new Error("This time slot is already booked");
  }
  const booking = await prisma.booking.create({
    data: {
      date: bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      tutorId: data.tutorId,
      studentId: data.studentId,
      status: BookingStatus.CONFIRMED
    }
  });
  return booking;
};
var getUserBookings = async (userId, role) => {
  if (role === "STUDENT") {
    return await prisma.booking.findMany({
      where: { studentId: userId },
      include: {
        tutor: true
      },
      orderBy: { date: "desc" }
    });
  }
  if (role === "TUTOR") {
    return await prisma.booking.findMany({
      where: { tutorId: userId },
      include: {
        student: true
      },
      orderBy: { date: "desc" }
    });
  }
  return await prisma.booking.findMany({
    include: {
      student: true,
      tutor: true
    },
    orderBy: { date: "desc" }
  });
};
var getBookingById = async (bookingId) => {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      student: true,
      tutor: true,
      review: true
    }
  });
};
var updateBooking = async (bookingId, user, data) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
    throw new Error("This booking can no longer be updated");
  }
  if (user.role === "STUDENT") {
    if (booking.studentId !== user.id) {
      throw new Error("Forbidden");
    }
    if (data.status !== BookingStatus.CANCELLED) {
      throw new Error("Student can only cancel booking");
    }
  }
  if (user.role === "TUTOR") {
    if (booking.tutorId !== user.id) {
      throw new Error("Forbidden");
    }
    if (data.status !== BookingStatus.COMPLETED) {
      throw new Error("Tutor can only mark booking as completed");
    }
  }
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: data.status
    }
  });
};
var BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== "STUDENT") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { tutorId, date, startTime, endTime } = req.body;
    console.log(req.body);
    const booking = await BookingService.createBooking({
      studentId: user.id,
      tutorId,
      date,
      startTime,
      endTime
    });
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Booking failed"
    });
  }
};
var getBookings = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const bookings = await BookingService.getUserBookings(user.id, user.role);
    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings"
    });
  }
};
var getBookingDetails = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const booking = await BookingService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (user.role !== "ADMIN" && booking.studentId !== user.id && booking.tutorId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch booking details"
    });
  }
};
var updateBooking2 = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }
    const updatedBooking = await BookingService.updateBooking(
      id,
      {
        id: user.id,
        role: user.role
      },
      { status }
    );
    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var BookingController = {
  createBooking: createBooking2,
  getBookings,
  getBookingDetails,
  updateBooking: updateBooking2
};

// src/modules/booking/booking.routes.ts
var router4 = Router();
router4.post("/", auth("STUDENT"), BookingController.createBooking);
router4.get(
  "/",
  auth("STUDENT", "TUTOR", "ADMIN"),
  BookingController.getBookings
);
router4.get(
  "/:id",
  auth("STUDENT", "TUTOR", "ADMIN"),
  BookingController.getBookingDetails
);
router4.patch(
  "/:id",
  auth("STUDENT", "TUTOR", "ADMIN"),
  BookingController.updateBooking
);
var BookingRoutes = router4;

// src/modules/review/review.routes.ts
import { Router as Router2 } from "express";

// src/modules/review/review.service.ts
var createReview = async (data) => {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.studentId !== data.studentId || booking.tutorId !== data.tutorId) {
    throw new Error("Invalid booking for this review");
  }
  const review = await prisma.review.create({
    data
  });
  return review;
};
var getReviewsByTutor = async (tutorId) => {
  return prisma.review.findMany({
    where: { tutorId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getReviewsByStudent = async (studentId) => {
  return prisma.review.findMany({
    where: { studentId },
    include: {
      tutor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      booking: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateReview = async (reviewId, studentId, data) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review || review.studentId !== studentId) {
    throw new Error("Unauthorized or review not found");
  }
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }
  return prisma.review.update({
    where: { id: reviewId },
    data
  });
};
var deleteReview = async (reviewId, studentId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review || review.studentId !== studentId) {
    throw new Error("Unauthorized or review not found");
  }
  await prisma.review.delete({
    where: { id: reviewId }
  });
  return { message: "Review deleted successfully" };
};
var ReviewService = {
  createReview,
  getReviewsByTutor,
  getReviewsByStudent,
  updateReview,
  deleteReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const { rating, comment, tutorId, bookingId } = req.body;
    const studentId = req.user.id;
    const review = await ReviewService.createReview({
      rating,
      comment,
      studentId,
      tutorId,
      bookingId
    });
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getTutorReviews = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const reviews = await ReviewService.getReviewsByTutor(tutorId);
    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getMyReviews = async (req, res) => {
  try {
    const studentId = req.user.id;
    const reviews = await ReviewService.getReviewsByStudent(
      studentId
    );
    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var updateReview2 = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const studentId = req.user.id;
    const review = await ReviewService.updateReview(
      reviewId,
      studentId,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message
    });
  }
};
var deleteReview2 = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const studentId = req.user.id;
    const result = await ReviewService.deleteReview(
      reviewId,
      studentId
    );
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message
    });
  }
};
var ReviewController = {
  createReview: createReview2,
  getTutorReviews,
  getMyReviews,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/modules/review/review.routes.ts
var router5 = Router2();
router5.post(
  "/",
  auth(Role.STUDENT),
  ReviewController.createReview
);
router5.get(
  "/tutor/:tutorId",
  ReviewController.getTutorReviews
);
router5.get(
  "/me",
  auth(Role.STUDENT),
  ReviewController.getMyReviews
);
router5.patch(
  "/:reviewId",
  auth(Role.STUDENT),
  ReviewController.updateReview
);
router5.delete(
  "/:reviewId",
  auth(Role.STUDENT),
  ReviewController.deleteReview
);
var ReviewRoutes = router5;

// src/modules/availability/availability.routes.ts
import { Router as Router3 } from "express";

// src/modules/availability/availability.service.ts
var createAvailability = async (data) => {
  const exists = await prisma.availability.findFirst({
    where: {
      tutorId: data.tutorId,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime
    }
  });
  if (exists) {
    throw new Error("Availability slot already exists");
  }
  return prisma.availability.create({
    data: {
      tutorId: data.tutorId,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime
    }
  });
};
var getAvailabilityByTutor = async (tutorId) => {
  return prisma.availability.findMany({
    where: { tutorId },
    orderBy: { day: "asc" }
  });
};
var updateAvailability = async (availabilityId, data) => {
  const availability = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      tutorId: data.tutorId
    }
  });
  if (!availability) {
    throw new Error("Availability not found");
  }
  return prisma.availability.update({
    where: { id: availabilityId },
    data
  });
};
var deleteAvailability = async (availabilityId, tutorId) => {
  const availability = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      tutorId
    }
  });
  if (!availability) {
    throw new Error("Availability not found");
  }
  return prisma.availability.delete({
    where: { id: availabilityId }
  });
};
var AvailabilityService = {
  createAvailability,
  getAvailabilityByTutor,
  updateAvailability,
  deleteAvailability
};

// src/modules/availability/availability.controller.ts
var createAvailability2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const { day, startTime, endTime, tutorId } = req.body;
    if (!day || !startTime || !endTime || !tutorId) {
      return res.status(400).json({
        success: false,
        message: "Day, startTime and endTime are required"
      });
    }
    const result = await AvailabilityService.createAvailability({
      day,
      startTime,
      endTime,
      tutorId
    });
    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getMyAvailability = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await AvailabilityService.getAvailabilityByTutor(tutorId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var updateAvailability2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AvailabilityService.updateAvailability(
      id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var deleteAvailability2 = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { id } = req.params;
    await AvailabilityService.deleteAvailability(id, tutorId);
    res.status(200).json({
      success: true,
      message: "Availability deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var AvailabilityController = {
  createAvailability: createAvailability2,
  getMyAvailability,
  updateAvailability: updateAvailability2,
  deleteAvailability: deleteAvailability2
};

// src/modules/availability/availability.routes.ts
var router6 = Router3();
router6.post("/", auth(Role.TUTOR), AvailabilityController.createAvailability);
router6.get("/me", auth(Role.TUTOR), AvailabilityController.getMyAvailability);
router6.put("/:id", auth(Role.TUTOR), AvailabilityController.updateAvailability);
router6.delete("/:id", auth(Role.TUTOR), AvailabilityController.deleteAvailability);
var AvailabilityRoutes = router6;

// src/modules/user/user.routes.ts
import { Router as Router4 } from "express";

// src/modules/user/user.service.ts
var getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      tutorProfile: true
    }
  });
  return users;
};
var updateUserStatus = async (id, data) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data
  });
  return updatedUser;
};
var UserService = {
  getAllUsers,
  updateUserStatus
};

// src/modules/user/user.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users"
    });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UserService.updateUserStatus(id, req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update user"
    });
  }
};
var UserController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2
};

// src/modules/user/user.routes.ts
var router7 = Router4();
router7.get(
  "/",
  auth(Role.ADMIN),
  UserController.getAllUsers
);
router7.patch(
  "/:id",
  auth(Role.ADMIN),
  UserController.updateUserStatus
);
var UserRoutes = router7;

// src/app.ts
var app = express4();
app.use(
  cors({
    origin: [process.env.APP_URL || "http://localhost:3000", "http://localhost:3000", "https://skill-bridge-client-psi.vercel.app"],
    credentials: true
  })
);
app.use(express4.json());
app.use(cookieParser());
app.use("/api/auth", AuthRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/tutor", TutorProfileRoutes);
app.use("/api/booking", BookingRoutes);
app.use("/api/review", ReviewRoutes);
app.use("/api/availability", AvailabilityRoutes);
app.use("/api/user", UserRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
