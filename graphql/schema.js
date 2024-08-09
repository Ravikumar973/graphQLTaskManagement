const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLList, GraphQLString } = require('graphql');
const { UserType, TaskType, OrganizationType } = require('./types');
const User = require('../models/user');
const Task = require('../models/Task');
const Organization = require('../models/organization');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, context) {
        if (!context.user) throw new Error('Unauthenticated');
        return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, context) {
        if (!context.user) throw new Error('Unauthenticated');
        return User.find({ organizationId: context.user.organizationId });
      },
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args, context) {
        if (!context.user) throw new Error('Unauthenticated');
        return Task.find({ organizationId: context.user.organizationId });
      },
    },
    organizations: {
      type: new GraphQLList(OrganizationType),
      resolve(parent, args, context) {
        if (!context.user) throw new Error('Unauthenticated');
        return Organization.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        role: { type: GraphQLString },
        organizationId: { type: GraphQLID },
      },
      async resolve(parent, args, context) {
        if (context.user.role !== 'Admin') throw new Error('Unauthorized');
        const newUser = new User({
          username: args.username,
          password: args.password,
          role: args.role,
          organizationId: args.organizationId,
        });
        return await newUser.save();
      },
    },
    addTask: {
      type: TaskType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        dueDate: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      async resolve(parent, args, context) {
        if (context.user.role === 'User' && context.user._id !== args.userId) throw new Error('Unauthorized');
        const newTask = new Task({
          title: args.title,
          description: args.description,
          status: args.status,
          dueDate: args.dueDate,
          userId: args.userId,
          organizationId: context.user.organizationId,
        });
        return await newTask.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
