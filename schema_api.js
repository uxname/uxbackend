const {gql} = require('apollo-server-express');

module.exports = {
    typeDefs: gql`
        type Query {
            products(where: ProductWhereInput, orderBy: ProductOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Product]!
        }
        
        type Mutation {
            createProduct(data: ProductCreateInput!): Product!
        }

        type AggregateCategory {
          count: Int!
        }
        
        type AggregateProduct {
          count: Int!
        }
        
        type AggregateUser {
          count: Int!
        }
        
        type BatchPayload {
          count: Long!
        }
        
        type Category {
          id: ID!
          title: String!
          description: String
          subcategories(where: CategoryWhereInput, orderBy: CategoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Category!]
          products(where: ProductWhereInput, orderBy: ProductOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Product!]
        }
        
        type CategoryConnection {
          pageInfo: PageInfo!
          edges: [CategoryEdge]!
          aggregate: AggregateCategory!
        }
        
        input CategoryCreateInput {
          title: String!
          description: String
          subcategories: CategoryCreateManyInput
          products: ProductCreateManyWithoutCategoriesInput
        }
        
        input CategoryCreateManyInput {
          create: [CategoryCreateInput!]
          connect: [CategoryWhereUniqueInput!]
        }
        
        input CategoryCreateManyWithoutProductsInput {
          create: [CategoryCreateWithoutProductsInput!]
          connect: [CategoryWhereUniqueInput!]
        }
        
        input CategoryCreateWithoutProductsInput {
          title: String!
          description: String
          subcategories: CategoryCreateManyInput
        }
        
        type CategoryEdge {
          node: Category!
          cursor: String!
        }
        
        enum CategoryOrderByInput {
          id_ASC
          id_DESC
          title_ASC
          title_DESC
          description_ASC
          description_DESC
          createdAt_ASC
          createdAt_DESC
          updatedAt_ASC
          updatedAt_DESC
        }
        
        type CategoryPreviousValues {
          id: ID!
          title: String!
          description: String
        }
        
        type CategorySubscriptionPayload {
          mutation: MutationType!
          node: Category
          updatedFields: [String!]
          previousValues: CategoryPreviousValues
        }
        
        input CategorySubscriptionWhereInput {
          mutation_in: [MutationType!]
          updatedFields_contains: String
          updatedFields_contains_every: [String!]
          updatedFields_contains_some: [String!]
          node: CategoryWhereInput
          AND: [CategorySubscriptionWhereInput!]
          OR: [CategorySubscriptionWhereInput!]
          NOT: [CategorySubscriptionWhereInput!]
        }
        
        input CategoryUpdateDataInput {
          title: String
          description: String
          subcategories: CategoryUpdateManyInput
          products: ProductUpdateManyWithoutCategoriesInput
        }
        
        input CategoryUpdateInput {
          title: String
          description: String
          subcategories: CategoryUpdateManyInput
          products: ProductUpdateManyWithoutCategoriesInput
        }
        
        input CategoryUpdateManyInput {
          create: [CategoryCreateInput!]
          update: [CategoryUpdateWithWhereUniqueNestedInput!]
          upsert: [CategoryUpsertWithWhereUniqueNestedInput!]
          delete: [CategoryWhereUniqueInput!]
          connect: [CategoryWhereUniqueInput!]
          disconnect: [CategoryWhereUniqueInput!]
        }
        
        input CategoryUpdateManyWithoutProductsInput {
          create: [CategoryCreateWithoutProductsInput!]
          delete: [CategoryWhereUniqueInput!]
          connect: [CategoryWhereUniqueInput!]
          disconnect: [CategoryWhereUniqueInput!]
          update: [CategoryUpdateWithWhereUniqueWithoutProductsInput!]
          upsert: [CategoryUpsertWithWhereUniqueWithoutProductsInput!]
        }
        
        input CategoryUpdateWithoutProductsDataInput {
          title: String
          description: String
          subcategories: CategoryUpdateManyInput
        }
        
        input CategoryUpdateWithWhereUniqueNestedInput {
          where: CategoryWhereUniqueInput!
          data: CategoryUpdateDataInput!
        }
        
        input CategoryUpdateWithWhereUniqueWithoutProductsInput {
          where: CategoryWhereUniqueInput!
          data: CategoryUpdateWithoutProductsDataInput!
        }
        
        input CategoryUpsertWithWhereUniqueNestedInput {
          where: CategoryWhereUniqueInput!
          update: CategoryUpdateDataInput!
          create: CategoryCreateInput!
        }
        
        input CategoryUpsertWithWhereUniqueWithoutProductsInput {
          where: CategoryWhereUniqueInput!
          update: CategoryUpdateWithoutProductsDataInput!
          create: CategoryCreateWithoutProductsInput!
        }
        
        input CategoryWhereInput {
          id: ID
          id_not: ID
          id_in: [ID!]
          id_not_in: [ID!]
          id_lt: ID
          id_lte: ID
          id_gt: ID
          id_gte: ID
          id_contains: ID
          id_not_contains: ID
          id_starts_with: ID
          id_not_starts_with: ID
          id_ends_with: ID
          id_not_ends_with: ID
          title: String
          title_not: String
          title_in: [String!]
          title_not_in: [String!]
          title_lt: String
          title_lte: String
          title_gt: String
          title_gte: String
          title_contains: String
          title_not_contains: String
          title_starts_with: String
          title_not_starts_with: String
          title_ends_with: String
          title_not_ends_with: String
          description: String
          description_not: String
          description_in: [String!]
          description_not_in: [String!]
          description_lt: String
          description_lte: String
          description_gt: String
          description_gte: String
          description_contains: String
          description_not_contains: String
          description_starts_with: String
          description_not_starts_with: String
          description_ends_with: String
          description_not_ends_with: String
          subcategories_every: CategoryWhereInput
          subcategories_some: CategoryWhereInput
          subcategories_none: CategoryWhereInput
          products_every: ProductWhereInput
          products_some: ProductWhereInput
          products_none: ProductWhereInput
          AND: [CategoryWhereInput!]
          OR: [CategoryWhereInput!]
          NOT: [CategoryWhereInput!]
        }
        
        input CategoryWhereUniqueInput {
          id: ID
        }
        
        scalar Long
        
        enum MutationType {
          CREATED
          UPDATED
          DELETED
        }
        
        interface Node {
          id: ID!
        }
        
        type PageInfo {
          hasNextPage: Boolean!
          hasPreviousPage: Boolean!
          startCursor: String
          endCursor: String
        }
        
        type Product {
          id: ID!
          title: String!
          description: String
          categories(where: CategoryWhereInput, orderBy: CategoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Category!]
        }
        
        type ProductConnection {
          pageInfo: PageInfo!
          edges: [ProductEdge]!
          aggregate: AggregateProduct!
        }
        
        input ProductCreateInput {
          title: String!
          description: String
          categories: CategoryCreateManyWithoutProductsInput
        }
        
        input ProductCreateManyWithoutCategoriesInput {
          create: [ProductCreateWithoutCategoriesInput!]
          connect: [ProductWhereUniqueInput!]
        }
        
        input ProductCreateWithoutCategoriesInput {
          title: String!
          description: String
        }
        
        type ProductEdge {
          node: Product!
          cursor: String!
        }
        
        enum ProductOrderByInput {
          id_ASC
          id_DESC
          title_ASC
          title_DESC
          description_ASC
          description_DESC
          createdAt_ASC
          createdAt_DESC
          updatedAt_ASC
          updatedAt_DESC
        }
        
        type ProductPreviousValues {
          id: ID!
          title: String!
          description: String
        }
        
        type ProductSubscriptionPayload {
          mutation: MutationType!
          node: Product
          updatedFields: [String!]
          previousValues: ProductPreviousValues
        }
        
        input ProductSubscriptionWhereInput {
          mutation_in: [MutationType!]
          updatedFields_contains: String
          updatedFields_contains_every: [String!]
          updatedFields_contains_some: [String!]
          node: ProductWhereInput
          AND: [ProductSubscriptionWhereInput!]
          OR: [ProductSubscriptionWhereInput!]
          NOT: [ProductSubscriptionWhereInput!]
        }
        
        input ProductUpdateInput {
          title: String
          description: String
          categories: CategoryUpdateManyWithoutProductsInput
        }
        
        input ProductUpdateManyWithoutCategoriesInput {
          create: [ProductCreateWithoutCategoriesInput!]
          delete: [ProductWhereUniqueInput!]
          connect: [ProductWhereUniqueInput!]
          disconnect: [ProductWhereUniqueInput!]
          update: [ProductUpdateWithWhereUniqueWithoutCategoriesInput!]
          upsert: [ProductUpsertWithWhereUniqueWithoutCategoriesInput!]
        }
        
        input ProductUpdateWithoutCategoriesDataInput {
          title: String
          description: String
        }
        
        input ProductUpdateWithWhereUniqueWithoutCategoriesInput {
          where: ProductWhereUniqueInput!
          data: ProductUpdateWithoutCategoriesDataInput!
        }
        
        input ProductUpsertWithWhereUniqueWithoutCategoriesInput {
          where: ProductWhereUniqueInput!
          update: ProductUpdateWithoutCategoriesDataInput!
          create: ProductCreateWithoutCategoriesInput!
        }
        
        input ProductWhereInput {
          id: ID
          id_not: ID
          id_in: [ID!]
          id_not_in: [ID!]
          id_lt: ID
          id_lte: ID
          id_gt: ID
          id_gte: ID
          id_contains: ID
          id_not_contains: ID
          id_starts_with: ID
          id_not_starts_with: ID
          id_ends_with: ID
          id_not_ends_with: ID
          title: String
          title_not: String
          title_in: [String!]
          title_not_in: [String!]
          title_lt: String
          title_lte: String
          title_gt: String
          title_gte: String
          title_contains: String
          title_not_contains: String
          title_starts_with: String
          title_not_starts_with: String
          title_ends_with: String
          title_not_ends_with: String
          description: String
          description_not: String
          description_in: [String!]
          description_not_in: [String!]
          description_lt: String
          description_lte: String
          description_gt: String
          description_gte: String
          description_contains: String
          description_not_contains: String
          description_starts_with: String
          description_not_starts_with: String
          description_ends_with: String
          description_not_ends_with: String
          categories_every: CategoryWhereInput
          categories_some: CategoryWhereInput
          categories_none: CategoryWhereInput
          AND: [ProductWhereInput!]
          OR: [ProductWhereInput!]
          NOT: [ProductWhereInput!]
        }
        
        input ProductWhereUniqueInput {
          id: ID
        }
        
        type User {
          id: ID!
          username: String!
          roles: [UserRole!]!
        }
        
        type UserConnection {
          pageInfo: PageInfo!
          edges: [UserEdge]!
          aggregate: AggregateUser!
        }
        
        input UserCreateInput {
          username: String!
          roles: UserCreaterolesInput
        }
        
        input UserCreaterolesInput {
          set: [UserRole!]
        }
        
        type UserEdge {
          node: User!
          cursor: String!
        }
        
        enum UserOrderByInput {
          id_ASC
          id_DESC
          username_ASC
          username_DESC
          createdAt_ASC
          createdAt_DESC
          updatedAt_ASC
          updatedAt_DESC
        }
        
        type UserPreviousValues {
          id: ID!
          username: String!
          roles: [UserRole!]!
        }
        
        enum UserRole {
          REGISTERED_USER
          ADMIN
        }
        
        type UserSubscriptionPayload {
          mutation: MutationType!
          node: User
          updatedFields: [String!]
          previousValues: UserPreviousValues
        }
        
        input UserSubscriptionWhereInput {
          mutation_in: [MutationType!]
          updatedFields_contains: String
          updatedFields_contains_every: [String!]
          updatedFields_contains_some: [String!]
          node: UserWhereInput
          AND: [UserSubscriptionWhereInput!]
          OR: [UserSubscriptionWhereInput!]
          NOT: [UserSubscriptionWhereInput!]
        }
        
        input UserUpdateInput {
          username: String
          roles: UserUpdaterolesInput
        }
        
        input UserUpdaterolesInput {
          set: [UserRole!]
        }
        
        input UserWhereInput {
          id: ID
          id_not: ID
          id_in: [ID!]
          id_not_in: [ID!]
          id_lt: ID
          id_lte: ID
          id_gt: ID
          id_gte: ID
          id_contains: ID
          id_not_contains: ID
          id_starts_with: ID
          id_not_starts_with: ID
          id_ends_with: ID
          id_not_ends_with: ID
          username: String
          username_not: String
          username_in: [String!]
          username_not_in: [String!]
          username_lt: String
          username_lte: String
          username_gt: String
          username_gte: String
          username_contains: String
          username_not_contains: String
          username_starts_with: String
          username_not_starts_with: String
          username_ends_with: String
          username_not_ends_with: String
          AND: [UserWhereInput!]
          OR: [UserWhereInput!]
          NOT: [UserWhereInput!]
        }
        
        input UserWhereUniqueInput {
          id: ID
        }
    `
};
