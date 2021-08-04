import {GraphQLDateTime} from 'graphql-iso-date'
import Mutation from "./mutation";
import Query from "./query";

const resolvers = {
  Query,
  Mutation,
  Date:GraphQLDateTime
};

export default resolvers;
