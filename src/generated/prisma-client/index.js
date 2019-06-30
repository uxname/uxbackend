"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Product",
    embedded: false
  },
  {
    name: "Category",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "ActivationCode",
    embedded: false
  },
  {
    name: "RestoreCode",
    embedded: false
  },
  {
    name: "UserRole",
    embedded: false
  },
  {
    name: "Conversation",
    embedded: false
  },
  {
    name: "ConversationParticipant",
    embedded: false
  },
  {
    name: "ConversationParticipantRole",
    embedded: false
  },
  {
    name: "ConversationType",
    embedded: false
  },
  {
    name: "Message",
    embedded: false
  },
  {
    name: "MessageType",
    embedded: false
  },
  {
    name: "BlockList",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA_ENDPOINT"]}`,
  secret: `${process.env["PRISMA_SECRET"]}`
});
exports.prisma = new exports.Prisma();
