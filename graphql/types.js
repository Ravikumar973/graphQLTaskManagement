const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLScalarType,
    GraphQLBoolean,
  } = require('graphql');
  const User = require('../models/user');
  const Task = require('../models/Task');
  const Organization = require('../models/organization');
  
  const OrganizationType = new GraphQLObjectType({
    name: 'Organization',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
    }),
  });
  
  const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: GraphQLID },
      username: { type: GraphQLString },
      role: { type: GraphQLString },
      organization: {
        type: OrganizationType,
        resolve(parent, args) {
          return Organization.findById(parent.organizationId);
        },
      },
    }),
  });
  
  const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      status: { type: GraphQLString },
      dueDate: { type: GraphQLString },
      user: {
        type: UserType,
        resolve(parent, args) {
          return User.findById(parent.userId);
        },
      },
      organization: {
        type: OrganizationType,
        resolve(parent, args) {
          return Organization.findById(parent.organizationId);
        },
      },
    }),
  });
  
  module.exports = {
    OrganizationType,
    UserType,
    TaskType,
  };
  